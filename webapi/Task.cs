using System.ComponentModel.DataAnnotations;

namespace webapi
{
    public class Task : ITask
    {
        public Guid Id { get; set; }

        [Required]
        public string Assignee { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        [Required]
        public  string Description { get; set; }

        public int? PercentCompleted { get; set; }
        public bool? IsPriority { get; set; }
       
        public Task(string Assignee, DateTime DueDate, string Description)
        {
            this.Id = Guid.NewGuid ();
            this.Assignee = Assignee;
            this.DueDate = DueDate;
            this.Description = Description;
        }
    }
}
