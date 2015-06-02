using DalskiAgent.Agents;
using DalskiAgent.Reasoning;
using SpatialAPI.Entities.Transformation;

namespace KNPZebraLionLayer
{
	public interface IZebra  : ISpatialAgent, IAgentLogic
	{
		Vector3 GetPosition ();
		Direction GetDirection();
		int GetState();
	}
}

