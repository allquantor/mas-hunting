using DalskiAgent.Agents;
using DalskiAgent.Reasoning;
using SpatialAPI.Entities.Transformation;

namespace KNPZebraLayer
{
	public interface IZebra  : ISpatialAgent, IAgentLogic
	{
		Vector3 GetPosition ();
		Direction GetDirection();
		int GetStatus();
	}
}

