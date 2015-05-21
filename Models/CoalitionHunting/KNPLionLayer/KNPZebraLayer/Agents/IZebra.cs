using DalskiAgent.Agents;
using DalskiAgent.Reasoning;
using SpatialAPI.Entities.Transformation;

namespace KNPZebraLayer
{
	public interface IZebra  : ISpatialAgent, IAgentLogic
	{
		Vector3 getPosition ();
		Direction GetDirection();
		int getStatus();
	}
}

