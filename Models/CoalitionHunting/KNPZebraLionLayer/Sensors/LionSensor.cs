using System;
using DalskiAgent.Perception;
using SpatialAPI.Environment;

namespace KNPZebraLionLayer
{
	public class LionSensor :ISensor
	{
		private readonly IEnvironment environment;
		public LionSensor (IEnvironment env)
		{
		}

		#region ISensor implementation

		public object Sense ()
		{
			throw new NotImplementedException ();
		}

		#endregion
	}
}

