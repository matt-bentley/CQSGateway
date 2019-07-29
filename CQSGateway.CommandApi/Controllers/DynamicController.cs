using CQSGateway.CommandApi.Application.Services.Abstract;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CQSGateway.CommandApi.Controllers
{
    [Route("api/{entityType}")]
    [ApiController]
    public class DynamicController : ControllerBase
    {
        private readonly IEntityService _service;

        public DynamicController(IEntityService service)
        {
            _service = service;
        }

        [HttpGet("{id}")]
        public IActionResult Get(string entityType, string id)
        {
            if(string.IsNullOrEmpty(entityType) || string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }
            var entity = _service.Get(entityType, id);
            return Ok(entity);
        }

        [HttpPost]
        public IActionResult Post(string entityType, [FromBody] object entity)
        {
            if (string.IsNullOrEmpty(entityType))
            {
                return BadRequest();
            }
            var inserted = _service.Insert(entityType, entity);
            return Ok(inserted);
        }

        [HttpPost("{id}/{childType}")]
        public IActionResult PostChild(string entityType, string id, string childType, [FromBody] object childEntity)
        {
            if (string.IsNullOrEmpty(entityType))
            {
                return BadRequest();
            }
            var inserted = _service.InsertChild(entityType, id, childType, childEntity);
            return Ok(inserted);
        }

        [HttpPut("{id}")]
        public IActionResult Put(string entityType, string id, [FromBody] object entity)
        {
            return Ok(_service.Update(entityType, id, entity));
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string entityType, string id)
        {
            _service.Delete(entityType, id);
            return Ok();
        }
    }
}
