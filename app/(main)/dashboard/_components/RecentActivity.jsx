import {
  BriefcaseIcon,
  MessageSquareIcon,
  UserIcon,
  FileTextIcon,
} from "lucide-react";

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "application",
      message: "John Smith applied to your Software Engineer job posting",
      time: "2 hours ago",
      icon: FileTextIcon,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100",
    },
    {
      id: 2,
      type: "message",
      message:
        "Sarah Johnson sent you a message about the UX Designer position",
      time: "5 hours ago",
      icon: MessageSquareIcon,
      iconColor: "text-green-500",
      iconBg: "bg-green-100",
    },
    {
      id: 3,
      type: "job",
      message: "Your Frontend Developer job posting has been approved",
      time: "Yesterday",
      icon: BriefcaseIcon,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-100",
    },
    {
      id: 4,
      type: "interview",
      message: "Interview scheduled with Michael Brown for DevOps Engineer",
      time: "2 days ago",
      icon: UserIcon,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-100",
    },
    {
      id: 5,
      type: "application",
      message: "Emily Davis applied to your Product Manager job posting",
      time: "3 days ago",
      icon: FileTextIcon,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-100",
    },
  ];

  return (
    <div className="space-y-5">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <div className={`${activity.iconBg} p-2 rounded-full`}>
            <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
          </div>
          <div className="space-y-1">
            <p className="text-sm">{activity.message}</p>
            <p className="text-xs text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
