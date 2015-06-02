using System;
using DalskiAgent.Agents;
using LifeAPI.Layer;
using SpatialAPI.Environment;
using SpatialAPI.Shape;
using SpatialAPI.Entities.Transformation;
using SpatialAPI.Entities.Movement;
using System.Collections.Generic;

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
		private double maxSPeed;
		private string strategy;

		private Double zebraViewFactor;



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
			double imageCoordY,
			double zebraViewFactor)
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

		Lion checkIfLionComming ()
		{
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
				}
			}

			closestLion





		}

		public DalskiAgent.Interactions.IInteraction Reason ()
		{
			switch (state) {

			case "chill":
				var possibleLion = checkIfLionComming();
					if (possibleLion != null) {
							
					} else {
						
					}
			case "flucht":
				
			}
		}

		#endregion
	}
}

