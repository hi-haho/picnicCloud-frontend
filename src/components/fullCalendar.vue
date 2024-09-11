<template>
  <FullCalendar
    :options="calendarOptions"
    @dateClick="handleDateClick"
  />
</template>
<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import { ref } from 'vue';
import apiClient from '@/api/api.js';
export default {
  name: 'FullCalendarComponent',
  components: {
    FullCalendar
  },
  emits: ['dateClick'],
  setup(props, { emit }) {
    const calendarOptions = ref({
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      showNonCurrentDates: false,
      fixedWeekCount: false,
      height: 'auto',
      contentHeight: 'auto',
      events: [],
      datesSet: handleDatesSet,
      headerToolbar: {
        right: 'prev today next'
      },
    });
    const pastelColors = ['#B9E3F3', '#87CEEB', '#2193C0'];
const fetchEventsForMonth = async (start, end) => {
  try {
    const response = await apiClient.get('/edu-events');
    const data = response.data;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const filteredEvents = data.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return (eventStart <= endDate && eventEnd >= startDate);
    }).map((event, index) => ({
      id: event.no,  // 이벤트 ID 추가
      title: event.title,
      start: event.startDate,
      end: event.endDate,
      color: pastelColors[index % pastelColors.length]
    })).slice(0, 3);
   
    calendarOptions.value.events = filteredEvents;
  } catch (error) {
    console.error('이벤트를 가져오는 중 오류 발생:', error);
  }
};
function handleDatesSet(info) {
  // info.start과 info.end는 Date 객체일 가능성이 높습니다.
  const start = info.start.toISOString().split('T')[0];  // 날짜 형식: YYYY-MM-DD
  const end = info.end.toISOString().split('T')[0];      // 날짜 형식: YYYY-MM-DD
  fetchEventsForMonth(start, end);
}
    function handleDateClick(info) {
      const dateStr = info.dateStr;
      emit('dateClick', dateStr);  // 부모 컴포넌트에 날짜 클릭 이벤트 전파
    }
    return {
      calendarOptions,
      handleDateClick
    };
  }
}
</script>


<style>
/* 오늘 버튼 스타일 */
.fc-today-button {
  background-color: white !important; /* 배경색 */
  color: rgb(19, 1, 1) !important;              /* 텍스트 색상 */
  border: none !important;              /* 테두리 제거 */
  border-radius: 5px !important;        /* 둥근 모서리 */
  padding: 5px 10px !important;         /* 여백 */
}

.fc-today-button:hover {
  background-color:  white !important; 
  scale: 1.1;
}

/* 이전 버튼 스타일 */
.fc-prev-button {
  background-color:  white !important; /* 배경색 */
  color:rgb(19, 1, 1) !important;              /* 텍스트 색상 */
  border: none !important;              /* 테두리 제거 */

}

.fc-prev-button:hover {
  background-color:  white !important; 
  scale: 1.1;
}

/* 다음 버튼 스타일 */
.fc-next-button {
  background-color:  white !important; /* 배경색 */
  color:rgb(19, 1, 1) !important;              /* 텍스트 색상 */
  border: none !important;              /* 테두리 제거 */
}

.fc-next-button:hover {
  background-color:  white !important; 
  scale: 1.1;
}

</style>
