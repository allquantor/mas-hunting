using System;
using Hik.Communication.ScsServices.Service;
using LifeAPI.Layer;

namespace KNPZebraLion
{
	[ScsService(Version = "0.1")]
	public interface IKNPZebraLionLayer : ISteppedActiveLayer {
		ILion GetLionById(Guid id);
	}
}
