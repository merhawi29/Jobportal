<div class="dropdown">
    <a class="nav-link dropdown-toggle position-relative" href="#" id="navbarDropdownNotifications" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fas fa-bell"></i>
        @if($unreadCount > 0)
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {{ $unreadCount > 9 ? '9+' : $unreadCount }}
                <span class="visually-hidden">unread notifications</span>
            </span>
        @endif
    </a>
    <ul class="dropdown-menu dropdown-menu-end notification-dropdown" aria-labelledby="navbarDropdownNotifications">
        <li>
            <div class="dropdown-header d-flex justify-content-between align-items-center">
                <span>Notifications</span>
                @if($unreadCount > 0)
                    <a href="#" class="text-decoration-none small mark-all-read">Mark all as read</a>
                @endif
            </div>
        </li>
        
        @if($notifications->isEmpty())
            <li><div class="dropdown-item text-muted">No notifications</div></li>
        @else
            @foreach($notifications as $notification)
                <li>
                    <a class="dropdown-item notification-item {{ is_null($notification->read_at) ? 'unread' : '' }}" href="#">
                        <div class="d-flex align-items-center">
                            <div class="flex-shrink-0">
                                @if($notification->data['type'] ?? '' == 'profile_completed')
                                    <div class="notification-icon bg-success text-white">
                                        <i class="fas fa-check-circle"></i>
                                    </div>
                                @elseif(isset($notification->data['job_title']))
                                    <div class="notification-icon bg-primary text-white">
                                        <i class="fas fa-briefcase"></i>
                                    </div>
                                @else
                                    <div class="notification-icon bg-info text-white">
                                        <i class="fas fa-bell"></i>
                                    </div>
                                @endif
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <p class="mb-1 notification-text">{{ $notification->data['message'] ?? 'New notification' }}</p>
                                <small class="text-muted">{{ $notification->created_at->diffForHumans() }}</small>
                            </div>
                        </div>
                    </a>
                </li>
            @endforeach
        @endif
        
        <li><hr class="dropdown-divider"></li>
        <li>
            <a class="dropdown-item text-center" href="{{ route('notifications.index') }}">
                View all notifications
            </a>
        </li>
    </ul>
</div>

<style>
.notification-dropdown {
    width: 320px;
    max-height: 400px;
    overflow-y: auto;
}

.notification-item.unread {
    background-color: rgba(13, 110, 253, 0.05);
}

.notification-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notification-text {
    max-width: 250px;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const markAllReadButton = document.querySelector('.mark-all-read');
    if (markAllReadButton) {
        markAllReadButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            fetch('{{ route("notifications.mark-all-read") }}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update the UI
                    document.querySelectorAll('.notification-item.unread').forEach(item => {
                        item.classList.remove('unread');
                    });
                    
                    // Reset unread count badge
                    const badge = document.querySelector('#navbarDropdownNotifications .badge');
                    if (badge) {
                        badge.style.display = 'none';
                    }
                }
            })
            .catch(error => console.error('Error marking notifications as read:', error));
        });
    }
});
</script>