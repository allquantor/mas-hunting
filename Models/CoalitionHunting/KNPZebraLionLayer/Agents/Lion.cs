

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
using KNPZebraLionLayer;

namespace KNPZebraLionLayer
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
        private Zebra hunted_zebra;
		private Direction preyDirection;
		private double searchSpeed;
		private double preySpeed;
		private double maxSPeed;
		private string strategy;
		private double sightRange;
		private	Double criticalDistance;




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
			Lion prideLeader,
			Double criticalDistance
			)
			:
		base(layer, registerAgent, unregisterAgent, environment, id, shape, collisionType:CollisionType.Ghost) {
			_lat = lat;
			_lon = lon;
			_imageCoordX = imageCoordX;
			_imageCoordY = imageCoordY;
            preySpeed = 10;
            maxSPeed = 10;
			leading = true;
			state = "search";
			criticalDistance = 30.0;

			SensorArray.AddSensor(new ZebraSensor(environment));
		}


		private IInteraction searching() {

			var zebras = SensorArray.Get<ZebraSensor, List<Zebra>>();
			Zebra closest = null;

			if (zebras.Count > 0) {
				double distance;
				double nearest_distance = double.MaxValue;

				foreach (Zebra z in zebras) {
					Zebra ze = (Zebra)z;
					distance = GetPosition ().GetDistance (ze.GetPosition ());
					if (distance < nearest_distance) {
						closest = ze;
						nearest_distance = distance;

					}
				}
                hunted_zebra = closest;
				state = "stalking";
				return Mover.Continuous.Move (preySpeed, Mover.CalculateDirectionToTarget (hunted_zebra.GetPosition ()));
			} else {
				// todo implement follow the leader here or something that kind
				return Mover.Continuous.Move(preySpeed, 10,10);
			}

		}

		private IInteraction hunting ()
		{
			return Mover.Continuous.Move (maxSPeed, Mover.CalculateDirectionToTarget (hunted_zebra.GetPosition ()));
		}

		private IInteraction stalking() {
			if(this.GetPosition().GetDistance(hunted_zebra.GetPosition()) <= criticalDistance)  {
				state = "hunting";
				return hunting();
			} else {
				return Mover.Continuous.Move (preySpeed, Mover.CalculateDirectionToTarget (hunted_zebra.GetPosition ()));

			}
		}




		public IInteraction Reason() {

			var mr = SensorArray.Get<MovementSensor, MovementResult>();

            IInteraction returnInteraction = null ;

			if (mr != null) {

			}

			switch (state) {
			case "searching":
				returnInteraction = searching ();
				break;
			case "stalking":
				returnInteraction = stalking();
				break;
			case "hunting":
				returnInteraction = hunting();
				break;
			}

			return returnInteraction;
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



        int ILion.GetRole()
        {
            throw new NotImplementedException();
        }

    }
}
