using System;
using System.Collections.Generic;

using System.Globalization;
using System.IO;
using System.Linq;
using GeoAPI.Geometries;
using Hik.Communication.ScsServices.Service;
using KNPElevationLayer;
using KNPEnvironmentLayer;
using LayerLoggingService;
using KNPZebraLionLayer;
using LCConnector.TransportTypes;
using LifeAPI.Layer;
using Mono.Addins;
using SpatialAPI.Environment;
using SpatialAPI.Shape;
using ESC = EnvironmentServiceComponent.Implementation.EnvironmentServiceComponent;
using SpatialAPI.Entities.Movement;
using SpatialAPI.Entities.Transformation;
using SpatialAPI.Environment;
using SpatialAPI.Shape;
using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using Hik.Communication.ScsServices.Service;
using KNPElevationLayer;
using KNPEnvironmentLayer;
using LCConnector.TransportTypes;
using LifeAPI.Layer;
using Mono.Addins;



[assembly: Addin]
[assembly: AddinDependency("LayerContainer", "0.1")]

namespace KNPZebraLionLayer {


	/// <summary>
	///     Layer for the Marula trees in Skukuza.
	/// </summary>
	[Extension(typeof (ISteppedLayer))]
	public class KNPZebraLion : ScsService, IKNPZebraLionLayer {

		private readonly string _startTime; // Local time of simulation begin.
		private readonly IKNPEnvironmentLayer _environment; // Spatial environment for the trees. 
		private readonly IKNPElevationLayer _elevationLayer;
		private long _tick; // Current tick.   

		private ILayerLogger _csvLogger; // Logger for CSV file output.
		private ILayerLogger _consoleLogger; // Logger for CSV file output.

		private Dictionary<Guid, ILion> _lionAgents; // ID-to-agent mapping.
		private Dictionary<Guid, IZebra> _zebraAgents; // ID-to-agent mapping.
		// Current season.


		/// <summary>
		///     Create new layer for Marula trees.
		/// </summary>
		/// <param name="environment"></param>
		/// <param name="elevationLayer"></param>
		public KNPZebraLion(IKNPEnvironmentLayer environment, IKNPElevationLayer elevationLayer) {
			_environment = environment;
			_elevationLayer = elevationLayer;
			_startTime = DateTime.Now.ToString("s");
			_lionAgents = new Dictionary<Guid, ILion>();
			_zebraAgents = new Dictionary<Guid, IZebra>();
		}

		#region ISteppedActiveLayer Members

		/// <summary>
		///     Initializes this layer.
		/// </summary>
		/// <param name="layerInitData">Generic layer init data object. Not used here!</param>
		/// <param name="regHndl">Delegate for agent registration function.</param>
		/// <param name="unregHndl">Delegate for agent unregistration function.</param>
		/// <returns>Initialization success flag.</returns>
		public bool InitLayer(TInitData layerInitData, RegisterAgent regHndl, UnregisterAgent unregHndl) {

			// Create file logger.
			var timeStamp = DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss-fff");
			_csvLogger = new LayerLoggerCsv(csvDirectoryPath: "./", csvFileName: "output" + timeStamp + ".csv", csvDelimiter: ";");

			var lionAgentInitConfig = layerInitData.AgentInitConfigs.First();
			var zebraAgentInitConfig = layerInitData.AgentInitConfigs[1]; //layerInitData.AgentInitConfigs;

			double MinX = 31.331;
			double MinY = -25.292;
			double MaxX = 31.985;
			double MaxY = -24.997;

			var lat = GetRandomDouble(MinX, MaxX);
			var lon = GetRandomDouble(MinY, MaxY);


			var lionCoordinates = new Coordinate[3];
			lionCoordinates [0] = new Coordinate (0, 0);
			lionCoordinates [1] = new Coordinate (5, 2);
			lionCoordinates [2] = new Coordinate (10, 0);
			var criticalDistance = 50;

			var zebraCoordinates = new Coordinate[1];
			zebraCoordinates [0] = new Coordinate (50,0);

			for(var i=0; i < lionAgentInitConfig.RealAgentCount; i++) {
				var imageCoords = _elevationLayer.TransformToImage(lionCoordinates[i].X, lionCoordinates[i].Y);
				IShape animalShape = new Cuboid (
					new Vector3 (1, 1, 1),
					new Vector3 (imageCoords.X, 0, imageCoords.Y));
				_lionAgents.Add(
					lionAgentInitConfig.RealAgentIds[i],
					new Lion(this, regHndl, unregHndl, _environment, _elevationLayer, lionAgentInitConfig.RealAgentIds[i],animalShape, lionCoordinates[i].X, lionCoordinates[i].Y, imageCoords.X, imageCoords.Y, criticalDistance)
				);
			}

			for(var i=0; i < zebraAgentInitConfig.RealAgentCount; i++) {
				var imageCoords = _elevationLayer.TransformToImage(lionCoordinates[i].X, lionCoordinates[i].Y);
				IShape animalShape = new Cuboid (
					new Vector3 (1, 1, 1),
					new Vector3 (imageCoords.X, 0, imageCoords.Y));
				_zebraAgents.Add(
					zebraAgentInitConfig.RealAgentIds[i],
					new Zebra(this, regHndl, unregHndl, _environment, _elevationLayer, zebraAgentInitConfig.RealAgentIds[i],animalShape, lionCoordinates[i].X, lionCoordinates[i].Y, imageCoords.X, imageCoords.Y)
				);
			}

			return true;
		}


		public ILion GetLionById (Guid id)
		{
			return _lionAgents [id];
		}


		public IZebra GetZebraById (Guid id)
		{
			return _zebraAgents [id];
		}


		/// <summary>
		///     Returns the current tick.
		/// </summary>
		/// <returns>Current tick value.</returns>
		public long GetCurrentTick() {
			return _tick;
		}


		/// <summary>
		///     Sets the current tick. This function is called by the RTE manager in each tick.
		/// </summary>
		/// <param name="currentTick">current tick value.</param>
		public void SetCurrentTick(long currentTick) {
			_tick = currentTick;
		}


		/// <summary>
		///     Post tick execution.
		/// </summary>
		public void PostTick() {
			LogTreeDetails();
			LogLayerSummaryToCsv();
		}


		public void Tick() {
			
		}


		public void PreTick() {
			
		}


		#endregion


		/// <summary>
		///     Log events with the attached loggers.
		/// </summary>
		/// <param name="p">Logging payload.</param>
		private void LogTreeDetails() {
			foreach (Lion lion in _lionAgents.Values) {
				var basic = new JsonObject(new List<JsonProperty>());
				basic.Properties.Add(new JsonProperty("LayerName", "ZebraLionLayer"));
				basic.Properties.Add(new JsonProperty("starttime", _startTime));
				foreach (var jsonProperty in lion.ToJson())
				{
					basic.Properties.Add(jsonProperty);
				}
				_csvLogger.Log (basic);
			}

			foreach (Zebra zebra in _zebraAgents.Values) {
				var basic = new JsonObject(new List<JsonProperty>());
				basic.Properties.Add(new JsonProperty("LayerName", "ZebraLionLayer"));
				basic.Properties.Add(new JsonProperty("starttime", _startTime));
				foreach (var jsonProperty in zebra.ToJson())
				{
					basic.Properties.Add(jsonProperty);
				}
				_csvLogger.Log (basic);
			}
				
		}

		private void LogLayerSummaryToCsv() {
			//			_csvLogger.Log
			//			(new JsonObject
			//				(new[] {
			//					new JsonProperty("TreeCount", _agents.Values.Select(tree => tree.GetIsAlive()).Count()),
			//					new JsonProperty("AverageHeight", _agents.Values.Average(tree => tree.GetHeight()))
			//				})
			//			);
		}

		private double GetRandomDouble(double minimum, double maximum)
		{
			var random = new Random(54897439);
			return random.NextDouble() * (maximum - minimum) + minimum;
		}
	}

}