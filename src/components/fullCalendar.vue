<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import { onMounted, ref } from 'vue';
import axios from 'axios';

export default {
  name: 'FullCalendarComponent',
  components: {
    FullCalendar
  },
  setup() {
    const calendarOptions = ref({
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      showNonCurrentDates: false, // 현재 달에 속하지 않은 날짜 숨기기
      fixedWeekCount: false, // 주 수를 유동적으로 표시
      height: 'auto', // 높이를 유동적으로 조정
      contentHeight: 'auto', // 내용 높이를 자동으로
      events: [],  // 초기에는 빈 배열
      datesSet: handleDatesSet,  // 달이 바뀔 때 이벤트 핸들링
      headerToolbar: {
        right: 'today prev,next' // 오른쪽에 이전/다음 버튼 배치
      },
    });

    // 연한 파스텔톤 색상 리스트
    const pastelColors = ['#B9E3F3', '#87CEEB', '#2193C0'];

    // 특정 월의 이벤트만 가져오는 함수
    const fetchEventsForMonth = async (start, end) => {
      try {
        // 서버에서 이벤트 데이터를 가져옴
        const response = await axios.get('http://localhost:8080/api/edu-events');
        const data = response.data;

        // 이벤트를 주어진 월의 범위로 필터링
        const filteredEvents = data.filter(event => {
          const eventStart = new Date(event.startDate);
          return eventStart >= new Date(start) && eventStart <= new Date(end);
        }).map((event, index) => ({
          title: event.title,
          start: event.startDate,
          end: event.endDate,
          color: pastelColors[index % pastelColors.length]  // 색상을 순환하여 지정
        }));

        // 필터링된 이벤트로 캘린더 업데이트, 최대 3개의 이벤트만 표시
        calendarOptions.value.events = filteredEvents.slice(0, 3);
      } catch (error) {
        console.error('이벤트를 가져오는 중 오류 발생:', error);

        // 에러 처리 강화: 응답 데이터 확인
        if (error.response) {
          console.error('서버 응답 에러:', error.response.data);
        } else if (error.request) {
          console.error('서버로부터 응답이 없습니다:', error.request);
        } else {
          console.error('요청 중 에러:', error.message);
        }
      }
    };

    // 달이 변경될 때마다 호출되는 함수
    function handleDatesSet(info) {
      const start = info.start;
      const end = info.end;

      // 해당 월의 이벤트만 가져옴
      fetchEventsForMonth(start, end);
    }

    // 컴포넌트가 마운트될 때 초기 데이터를 가져오기 (초기 화면에 현재 달 데이터 로드)
    onMounted(() => {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      // 초기 로딩 시 현재 달의 데이터만 가져옴
      fetchEventsForMonth(start, end);
    });

    return {
      calendarOptions
    };
  }
}
</script>

<style>
  
</style>
