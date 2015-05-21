using DalskiAgent.Agents;
using DalskiAgent.Reasoning;
using LayerLoggingService;
using SpatialAPI.Entities.Transformation;

namespace KNPLionLayer.Agents
{
	public interface ILion : ISpatialAgent, IAgentLogic
	{
		JsonProperty[] ToJson();

		Vector3 GetPosition();
		Direction GetDirection();
		int GetRole();

	}

}
