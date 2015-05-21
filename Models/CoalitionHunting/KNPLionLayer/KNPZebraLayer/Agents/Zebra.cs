using System;
using DalskiAgent.Agents;
using LifeAPI.Layer;
using SpatialAPI.Environment;
using SpatialAPI.Shape;

namespace KNPZebraLayer
{
	public class Zebra :SpatialAgent,IZebra
	{
		public Zebra (ILayer layer,
		RegisterAgent registerAgent,
		UnregisterAgent unregisterAgent,
		IEnvironment environment,
		Guid id,
		IShape shape,
		double lat,
		double lon,
		double imageCoordX,
		double imageCoordY,
		)
		{
		}
	}
}

