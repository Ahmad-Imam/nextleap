import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function LimitRow({ title, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{title}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function LimitCard({ label, data }) {
  const hasLimit = typeof data?.limit === "number";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <LimitRow title="Submitted" value={data?.submitted ?? 0} />
        <LimitRow title="Target" value={hasLimit ? data.limit : "Not set"} />
        <LimitRow
          title="Remaining"
          value={hasLimit ? data.remaining : "Not set"}
        />
        {hasLimit && (
          <div className="space-y-2 pt-1">
            <Progress value={data?.progress || 0} />
            <p className="text-xs text-muted-foreground">
              {data?.progress || 0}% of your {label.toLowerCase()} targets
              filled
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function ApplicationLimits({ analytics }) {
  return (
    <div className="w-full grid gap-4 md:grid-cols-2">
      <LimitCard label="Weekly Limit" data={analytics?.weekly} />
      <LimitCard label="Monthly Limit" data={analytics?.monthly} />
    </div>
  );
}
