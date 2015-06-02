using System;
using DalskiAgent.Agents;
using LifeAPI.Layer;
using SpatialAPI.Environment;
using SpatialAPI.Shape;
using SpatialAPI.Entities.Transformation;
using SpatialAPI.Entities.Movement;

namespace KNPZebraLayer
{
	public interface IZebra
{
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

