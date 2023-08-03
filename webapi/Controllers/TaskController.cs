using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class TaskController : ControllerBase
{
    private readonly ILogger<TaskController> _logger;
    private readonly TaskDbContext _dbContext;

    public TaskController(ILogger<TaskController> logger, TaskDbContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Task>> GetTasks()
    {
        return new ActionResult<IEnumerable<Task>>(_dbContext.Tasks);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTask(string id)
    {
        var task = await _dbContext.Tasks.FindAsync(Guid.Parse(id));
        return task == null ? NotFound() : Ok(task);
    }

    [HttpPost]
    public async Task<IActionResult> PostTask([FromBody] Task task)
    {
        // Required fields for incoming task are validated via [Required] in Task model
        await _dbContext.Tasks.AddAsync(task);
        await _dbContext.SaveChangesAsync();
        return Created($"{Request.GetDisplayUrl()}/{task.Id}", task.Id);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask([FromRoute]string id, [FromBody]Task inputTask)
    {
        var task = await _dbContext.Tasks.FindAsync(Guid.Parse(id));
        if (task is null) return NotFound();

        task.Assignee = inputTask.Assignee;
        task.DueDate = inputTask.DueDate;
        task.Description = inputTask.Description;
        task.PercentCompleted = inputTask.PercentCompleted;
        task.IsPriority = inputTask.IsPriority;

        await _dbContext.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(string id)
    {
        var taskToRemove = await _dbContext.Tasks.FindAsync(Guid.Parse(id));
        if (taskToRemove is null) return NotFound();
        _dbContext.Remove(taskToRemove);
        _dbContext.SaveChanges();
        return NoContent();
    }

}
