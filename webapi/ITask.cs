using System.ComponentModel.DataAnnotations;

namespace webapi
{
    public interface ITask
    {
        Guid Id { get; set; }

        [Required]
        string Assignee { get; set; }

        [Required]
        DateTime DueDate { get; set; }

        [Required]
        string Description { get; set; }

        public int? PercentCompleted { get; set; }
        bool? IsPriority { get; set; }
    }
}
