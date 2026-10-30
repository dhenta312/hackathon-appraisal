import { Component } from '@angular/core';

interface ActivityItem {
  user: string;
  action: string;
  target: string;
  time: string;
}

interface NotificationItem {
  text: string;
  time: string;
}

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent {
  readonly periodStart = '1 November 2026';
  readonly periodEnd = '30 November 2026';

  readonly notifications: NotificationItem[] = [
    { text: 'Periode penilaian kinerja telah dibuka.', time: '1 hari yang lalu' },
    { text: 'Anda memiliki 3 rekan setim yang belum dinilai.', time: '2 jam yang lalu' },
  ];

  readonly activities: ActivityItem[] = [
    { user: 'Andi', action: 'menilai', target: 'Citra', time: '4 jam yang lalu' },
    { user: 'Budi', action: 'mengirim penilaian untuk', target: 'Citra', time: '10 jam yang lalu' },
  ];
}
