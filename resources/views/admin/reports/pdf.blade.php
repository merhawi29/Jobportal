<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Job Portal Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 30px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #1a56db;
            margin-bottom: 10px;
        }
        .meta-info {
            margin-bottom: 30px;
            padding: 10px;
            background-color: #f3f4f6;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .stat-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        }
        .stat-item {
            padding: 10px;
            background-color: #f9fafb;
            border-radius: 5px;
        }
        .stat-label {
            font-weight: bold;
            color: #4b5563;
        }
        .stat-value {
            font-size: 1.2em;
            color: #1a56db;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        th {
            background-color: #f3f4f6;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Job Portal Report</h1>
        <p>{{ ucfirst($type) }} Report</p>
    </div>

    <div class="meta-info">
        <p><strong>Generated at:</strong> {{ $generated_at }}</p>
        <p><strong>Report Type:</strong> {{ ucfirst($type) }}</p>
    </div>

    @if($type === 'users' || $type === 'all')
    <div class="section">
        <h2>User Statistics</h2>
        <div class="stat-grid">
            @if(isset($job_seekers))
            <div class="stat-item">
                <div class="stat-label">Job Seekers</div>
                <div class="stat-value">{{ $job_seekers }}</div>
            </div>
            @endif
            @if(isset($employers))
            <div class="stat-item">
                <div class="stat-label">Employers</div>
                <div class="stat-value">{{ $employers }}</div>
            </div>
            @endif
            @if(isset($active_users))
            <div class="stat-item">
                <div class="stat-label">Active Users</div>
                <div class="stat-value">{{ $active_users }}</div>
            </div>
            @endif
            @if(isset($suspended_users))
            <div class="stat-item">
                <div class="stat-label">Suspended Users</div>
                <div class="stat-value">{{ $suspended_users }}</div>
            </div>
            @endif
        </div>
    </div>
    @endif

    @if($type === 'jobs' || $type === 'all')
    <div class="section">
        <h2>Job Statistics</h2>
        <div class="stat-grid">
            @if(isset($total_jobs))
            <div class="stat-item">
                <div class="stat-label">Total Jobs</div>
                <div class="stat-value">{{ $total_jobs }}</div>
            </div>
            @endif
            @if(isset($active_jobs))
            <div class="stat-item">
                <div class="stat-label">Active Jobs</div>
                <div class="stat-value">{{ $active_jobs }}</div>
            </div>
            @endif
            @if(isset($pending_jobs))
            <div class="stat-item">
                <div class="stat-label">Pending Jobs</div>
                <div class="stat-value">{{ $pending_jobs }}</div>
            </div>
            @endif
            @if(isset($applications))
            <div class="stat-item">
                <div class="stat-label">Total Applications</div>
                <div class="stat-value">{{ $applications }}</div>
            </div>
            @endif
        </div>

        @if(isset($jobs_by_type))
        <h3>Jobs by Type</h3>
        <table>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                @foreach($jobs_by_type as $job)
                <tr>
                    <td>{{ $job->type }}</td>
                    <td>{{ $job->count }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @endif
    </div>
    @endif

    @if($type === 'verifications' || $type === 'all')
    <div class="section">
        <h2>Verification Statistics</h2>
        <div class="stat-grid">
            @if(isset($total_verifications))
            <div class="stat-item">
                <div class="stat-label">Total Verifications</div>
                <div class="stat-value">{{ $total_verifications }}</div>
            </div>
            @endif
            @if(isset($pending_verifications))
            <div class="stat-item">
                <div class="stat-label">Pending Verifications</div>
                <div class="stat-value">{{ $pending_verifications }}</div>
            </div>
            @endif
            @if(isset($approved_verifications))
            <div class="stat-item">
                <div class="stat-label">Approved Verifications</div>
                <div class="stat-value">{{ $approved_verifications }}</div>
            </div>
            @endif
            @if(isset($rejected_verifications))
            <div class="stat-item">
                <div class="stat-label">Rejected Verifications</div>
                <div class="stat-value">{{ $rejected_verifications }}</div>
            </div>
            @endif
        </div>
    </div>
    @endif

    @if(isset($recent_activities))
    <div class="section">
        <h2>Recent Activities</h2>
        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                @foreach($recent_activities as $activity)
                <tr>
                    <td>{{ $activity->description }}</td>
                    <td>{{ $activity->created_at->format('Y-m-d H:i:s') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif
</body>
</html> 