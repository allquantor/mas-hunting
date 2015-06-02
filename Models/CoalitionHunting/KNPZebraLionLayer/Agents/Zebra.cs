using System;
using DalskiAgent.Agents;
using LifeAPI.Layer;
using SpatialAPI.Environment;
using SpatialAPI.Shape;
using SpatialAPI.Entities.Transformation;
using SpatialAPI.Entities.Movement;

namespace KNPZebraLayer
{
	public class Zebra :SpatialAgent,IZebra
	{



		private readonly double _lat;
		private readonly double _lon;
		private readonly double _imageCoordX;
		private readonly double _imageCoordY;
		private string state;
		private Direction preyDirection;
		private double preySpeed;
		private double maxSPeed;
		private string strategy;




		public Zebra 
		(ILayer layer,
			RegisterAgent registerAgent,
			UnregisterAgent unregisterAgent,
			IEnvironment environment,
			Guid id,
			IShape shape,
			double lat,
			double lon,
			double imageCoordX,
			double imageCoordY)
			:
		base(layer, registerAgent, unregisterAgent, environment, id, shape, collisionType:CollisionType.Ghost) {
			_lat = lat;
			_lon = lon;
			_imageCoordX = imageCoordX;
			_imageCoordY = imageCoordY;
			state = "chill";

			SensorArray.AddSensor(new LionSensor(environment));
		}

		#region IZebra implementation

		
		public Vector3 GetPosition() {
			return SpatialData.Position;
		}

		public Direction GetDirection() {
			return SpatialData.Direction;
		}
		}

		public int getStatus ()    
		{
			return 1;
		}

		#endregion

		#region IAgentLogic implementation

		public DalskiAgent.Interactions.IInteraction Reason ()
		{
			throw new NotImplementedException ();
		}

		#endregion
	}
}

