using System;
using DalskiAgent.Agents;
using LifeAPI.Layer;
using SpatialAPI.Environment;
using SpatialAPI.Shape;
using SpatialAPI.Entities.Transformation;
using SpatialAPI.Entities.Movement;
using KNPElevationLayer;
using System.Collections.Generic;
using DalskiAgent.Interactions;

namespace KNPZebraLionLayer
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
		private string strategy;
		private double maxSpeed = 30;
		private Double zebraViewFactor = 50;

		public Zebra 
		(ILayer layer,
			RegisterAgent registerAgent,
			UnregisterAgent unregisterAgent,
			IEnvironment environment,
			IKNPElevationLayer elevationLayer,
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


		public String GetState ()    
		{
			return state;
		}

		#endregion

		#region IAgentLogic implementation

        private IInteraction LookOut()
		{
            IInteraction movement = Mover.Continuous.Move(0, 0, 0);
			var lions = SensorArray.Get<LionSensor, List<Lion>>();
			Lion closestLion = null;


			if (lions.Count > 0) {
				double distance;
				double nearest_distance = double.MaxValue;

				foreach (Lion li in lions) {
					Lion l = (Lion)li;
					distance = GetPosition().GetDistance (l.GetPosition ());
					if (distance < nearest_distance) {
						closestLion = l;
						nearest_distance = distance;
					}
				}

				if (this.GetPosition ().GetDistance (closestLion.GetPosition ()) <= zebraViewFactor) {
					state = "flucht";
                    movement= Mover.Continuous.Move(maxSpeed, closestLion.GetDirection());
				
                }
			}
            return movement;
		}

		public DalskiAgent.Interactions.IInteraction Reason ()
		{
            IInteraction movement = Mover.Continuous.Move(0, 0, 0);
			switch (state) {

			case "chill":
                    movement = LookOut();
                    break;
                    
			case "flucht":
                   movement=  Mover.Continuous.Move(maxSpeed, GetDirection());
                   break;
			}
            return movement;
		}

		#endregion
	}
}

