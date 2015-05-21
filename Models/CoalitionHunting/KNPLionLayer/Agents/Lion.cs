

using System;
using System.Collections.Generic;
using DalskiAgent.Agents;
using DalskiAgent.Interactions;
using DalskiAgent.Perception;
using GeoAPI.Geometries;
using LayerLoggingService;
using LifeAPI.Layer;
using NetTopologySuite.Geometries;
using SpatialAPI.Entities.Movement;
using SpatialAPI.Entities.Transformation;
using SpatialAPI.Environment;
using SpatialAPI.Shape;
using KNPZebraLayer;
using KNPLionLayer.Sensors;
namespace KNPLionLayer.Agents
{
	public class Lion :SpatialAgent, ILion

	{
		private readonly double _lat;
		private readonly double _lon;
		private readonly double _imageCoordX;
		private readonly double _imageCoordY;
		private  bool leading;
		private Lion prideLeader;
		private string state;
		private Direction preyDirection;
		private double searchSpeed;
		private double preySpeed;
		private double maxSPeed;
		private string strategy;
		private double sightRange;


		public Lion
		(ILayer layer,
			RegisterAgent registerAgent,
			UnregisterAgent unregisterAgent,
			IEnvironment environment,
			Guid id,
			IShape shape,
			double lat,
			double lon,
			double imageCoordX,
			double imageCoordY,
			Lion prideLeader)
			:
		base(layer, registerAgent, unregisterAgent, environment, id, shape, collisionType:CollisionType.Ghost) {
			_lat = lat;
			_lon = lon;
			_imageCoordX = imageCoordX;
			_imageCoordY = imageCoordY;
			leading = true;
			state = "search";

			SensorArray.AddSensor(new ZebraSensor(environment));
		}

		public IInteraction Reason() {

			var mr = SensorArray.Get<MovementSensor, MovementResult>();

			if (mr != null) {

			}

			IEnumerable<Zebra> zebras = SensorArray.Get<ZebraSensor, IEnumerable<Zebra>>();

			foreach (Zebra z in zebras) {
				
			}

			//List<Coordinate> waterPoints = SensorArray.Get<WaterPointSensor, List<Coordinate>>();

			if (leading)
			{
				// todo: find target
				return Mover.Continuous.Move(10,0,50);
			}
			else
			{
				return Mover.Continuous.Move(10, prideLeader.GetDirection());
			}
		}

		public JsonProperty[] ToJson() {
			return null;
		}

		public Vector3 GetPosition() {
			return SpatialData.Position;
		}

		public Direction GetDirection() {
			return SpatialData.Direction;
		}

		public void startPrey(Direction zebraDirection, Lion leader)
		{
			state = "prey";
			prideLeader = leader;
			preyDirection = zebraDirection;
		}

	}
}
