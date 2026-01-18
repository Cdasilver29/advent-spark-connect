import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, UserCheck, TrendingUp, Clock } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface Registration {
  id: string;
  checked_in: boolean;
  checked_in_at: string | null;
  registered_at: string;
}

interface TimelineData {
  time: string;
  checkIns: number;
  cumulative: number;
}

const CheckInStatistics = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);

  useEffect(() => {
    fetchRegistrations();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('registrations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registrations',
        },
        () => {
          fetchRegistrations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRegistrations = async () => {
    const { data, error } = await supabase
      .from("registrations")
      .select("id, checked_in, checked_in_at, registered_at")
      .order("checked_in_at", { ascending: true });

    if (data && !error) {
      setRegistrations(data);
      processTimelineData(data);
    }
    setLoading(false);
  };

  const processTimelineData = (data: Registration[]) => {
    const checkedInData = data.filter(r => r.checked_in && r.checked_in_at);
    
    if (checkedInData.length === 0) {
      setTimelineData([]);
      return;
    }

    // Group by hour
    const hourlyData: Record<string, number> = {};
    
    checkedInData.forEach(reg => {
      if (reg.checked_in_at) {
        const date = new Date(reg.checked_in_at);
        const hour = date.getHours();
        const hourFormatted = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hourKey = `${hourFormatted}:00 ${ampm}`;
        hourlyData[hourKey] = (hourlyData[hourKey] || 0) + 1;
      }
    });

    // Convert to array and calculate cumulative
    let cumulative = 0;
    const timeline = Object.entries(hourlyData).map(([time, checkIns]) => {
      cumulative += checkIns;
      return { time, checkIns, cumulative };
    });

    setTimelineData(timeline);
  };

  const totalRegistered = registrations.length;
  const totalCheckedIn = registrations.filter(r => r.checked_in).length;
  const checkInRate = totalRegistered > 0 
    ? Math.round((totalCheckedIn / totalRegistered) * 100) 
    : 0;
  const pendingCheckIn = totalRegistered - totalCheckedIn;

  const chartConfig = {
    checkIns: {
      label: "Check-ins",
      color: "hsl(var(--primary))",
    },
    cumulative: {
      label: "Total",
      color: "hsl(var(--secondary))",
    },
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-24" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistered}</div>
            <p className="text-xs text-muted-foreground">
              Participants signed up
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalCheckedIn}</div>
            <p className="text-xs text-muted-foreground">
              Attendees present
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Check-in Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkInRate}%</div>
            <Progress value={checkInRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{pendingCheckIn}</div>
            <p className="text-xs text-muted-foreground">
              Yet to arrive
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Check-in Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {timelineData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorCheckIns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="cumulative"
                    stroke="hsl(var(--secondary))"
                    fillOpacity={1}
                    fill="url(#colorCumulative)"
                    name="Cumulative Check-ins"
                  />
                  <Area
                    type="monotone"
                    dataKey="checkIns"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorCheckIns)"
                    name="Check-ins per Hour"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No check-ins yet</p>
                <p className="text-sm">Check-in timeline will appear here during the event</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckInStatistics;
