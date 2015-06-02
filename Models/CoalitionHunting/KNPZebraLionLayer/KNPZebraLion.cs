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
using LCConnector.TransportTypes;
using LifeAPI.Layer;
using Mono.Addins;
using SpatialAPI.Environment;
using ESC = EnvironmentServiceComponent.Implementation.EnvironmentServiceComponent;

[assembly: Addin]
[assembly: AddinDependency("LayerContainer", "0.1")]

namespace KNPZebraLion {


	/// <summary>
	///     Layer for the Marula trees in Skukuza.
	/// </summary>
	[Extension(typeof (ISteppedLayer))]
	public class KNPZebraLion : ScsService, IKNPZebraLionLayer {

		private readonly string _startTime; // Local time of simulation begin.
		private readonly IEnvironment _environment; // Spatial environment for the trees. 
		private readonly IKNPElevationLayer _elevationLayer;
		private long _tick; // Current tick.   

		//private LayerLogger _csvLogger; // Logger for CSV file output.

		private Dictionary<Guid, ILion> _agents; // ID-to-agent mapping.
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
			_agents = new Dictionary<Guid, ILion>();
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

			//_csvLogger = new LayerLogger(csvDirectoryPath: "./", csvFileName: "output" + timeStamp + ".csv", csvDelimiter: ";");


			//var agentInitConfig = layerInitData.AgentInitConfigs.First();
			// Create agents

			return true;
		}

		public ILion GetLionById (Guid id)
		{
			throw new NotImplementedException ();
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
		public void PreTick() {}

		#endregion


		/// <summary>
		///     Log events with the attached loggers.
		/// </summary>
		/// <param name="p">Logging payload.</param>
		private void LogTreeDetails() {
			//			foreach (var marulaTree in _agents.Values) {
			//				var basic = new JsonObject(new List<JsonProperty>());
			//				basic.Properties.Add(new JsonProperty("LayerName", "IknpMarulaLayer"));
			//				basic.Properties.Add(new JsonProperty("starttime", _startTime));
			//				foreach (var jsonProperty in marulaTree.ToJson())
			//				{
			//					basic.Properties.Add(jsonProperty);
			//				}
			//
			//				_csvLogger.Log(basic);
			//			}
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
	}

}