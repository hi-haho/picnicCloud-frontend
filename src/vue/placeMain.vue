<template>
  <div id="PlaceMain">
    <div v-if="loading">
      <p>날씨 정보를 받아오는 중 🏃‍♀️</p>
    </div>
    <div v-if="fiveDayWeather.length" class="weather-container">
      <!-- 하루치의 날씨씩 반복 렌더링 -->
      <div
        class="weather-card"
        v-for="(day, index) in fiveDayWeather"
        :key="index"
      >
        <h3>{{ day.date }}</h3>
        <!-- 날짜 -->
        <p><img :src="day.iconUrl" alt="weather icon" /></p>
        <!-- 아이콘 -->
        <p>{{ day.description }}</p>
        <!-- 설명 -->
        <p>평균 {{ day.avg.toFixed(1) }}°</p>
        <!-- 하루 평균 온도 -->
        <p>{{ day.min.toFixed(1) }}°/{{ day.max.toFixed(1) }}°</p>
        <!-- 하루 최저, 최고온도 -->
      </div>
    </div>
    <!-- 날씨 데이터가 없을 때 메시지 표시 -->

    <div v-else>

<p>날씨 데이터를 불러오지 못했습니다.</p>

</div>
    <br /><br />
    <!--이미지 클릭시 카데고리값 쿼리문자열로 전달. 페이지 전환. -->
      <!--실내 테마-->
      <div class="image-group">
        <div class="caption">
          <h3>실내 테마</h3>
          <p>더위와 비를 피하기 위한 최고의 장소들!</p>
        </div>
        <div class="images">
          <!-- 테마별 이미지 클릭하면, 해당 테마의 장소목록으로 넘어감-->
          <div class="image">
            <router-link :to="{path: '/placeSearch', query: { placeType: '아동서점' }}">
              <img src="../image/places/ChildBookstore.png" alt="아동서점" />
            </router-link>
          </div>
          <div class="image">
            <router-link
              :to="{
                path: '/placeSearch',
                query: { placeType: '공공형 키즈카페' }
              }"
            >
              <img src="../image/places/PublicKidsCafe.png" alt="공공형 키즈카페" />
          </router-link>
          </div>
        </div>
      </div>
      <!-- 실외 테마 -->
      <div class="image-group">
        <div class="caption">
          <h3>실외 테마</h3>
          <p>무더운 여름 이색놀이를 즐겨봐요!</p>
        </div>
        <div class="images">
          <div class="image">
          <router-link
            :to="{ path: '/placeSearch', query: { placeType: '자연휴양림' } }"
          >
            <img src="../image/places/ForestHouse.png" alt="자연휴양림" />
          </router-link>
        </div>
        <div class="image">
          <router-link
            :to="{ path: '/placeSearch', query: { placeType: '캠핑' } }"
          >
            <img src="../image/places/Camping.png" alt="캠핑" />
          </router-link>
        </div>
        </div>
      </div>
    
  </div>
</template>

<script>
export default {
  name: "PlaceMain",
  data() {
    return {
      //초기화
      fiveDayWeather: [], // 5일간의 날씨 정보를 저장할 배열
      loading: true, // 로딩 상태를 위한 변수 추가
    };
  },
  methods: {
    formatDate(dateString) {
      // 날짜형식변환 메소드
      const date = new Date(dateString);

      const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1
      const day = date.getDate();
      const days = [
        "(일)",
        "(월)",
        "(화)",
        "(수)",
        "(목)",
        "(금)",
        "(토)",
      ];
      const dayOfWeek = days[date.getDay()];

      return `${month}월 ${day}일 ${dayOfWeek}`;
    },
    fetchWeather() {
      //open api. 3시간마다 5일치의 날씨 데이터. 위치= 서울 도시. 섭씨c, 한국어로 변환.
      fetch(
        "https://api.openweathermap.org/data/2.5/forecast?q=Seoul&appid=0697f7fdd534f182fef062a7ea42aead&units=metric&lang=kr"
      )
        .then((response) => response.json())
        .then((data) => {
          //5일간 날씨 정보 처리
          const days = {}; // 날짜별 날씨 정보를 저장할 객체

          data.list.forEach((entry) => {
            const entryDate = entry.dt_txt.split(" ")[0]; //2024-08-15
            // 날짜가 객체에 없으면 초기화
            //days 객체에 날짜별로 날씨 정보를 저장하기 위해 사용
            if (!days[entryDate]) {
              days[entryDate] = {
                date: entryDate,
                temps: [], // 온도 배열. 온도는 하루내내의 온도값들을 받아야하기에, 배열로.
                iconUrl: "", // 아이콘 URL. 값1개 저장.
                description: "", // 날씨 설명. 값1개 저장.
                closestTimeDiff: Number.MAX_VALUE, // 가장 가까운 시간 차이
              };
            }
            // 온도 배열에 추가
            days[entryDate].temps.push(entry.main.temp);

            const timeDiff = Math.abs(new Date(entry.dt_txt) - new Date()); // 현재 시간과의 차이 계산

            //낮 12시의 정보만 아이콘과 설명에 저장
            if (entry.dt_txt.endsWith("00:00:00")) {
              days[entryDate].description = entry.weather[0].description;
              days[
                entryDate
              ].iconUrl = `http://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`;
              days[entryDate].closestTimeDiff = timeDiff; // 낮 12시라면 시간 차이를 갱신
            } else if (timeDiff < days[entryDate].closestTimeDiff) {
              // 만약 오늘 날짜이고 낮 12시를 지나갔다면, 가장 가까운 시간으로 아이콘과 설명을 설정
              days[entryDate].description = entry.weather[0].description;
              days[
                entryDate
              ].iconUrl = `http://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`;
              days[entryDate].closestTimeDiff = timeDiff;
            }
          });

          //map() 사용하여 각 날짜별 정보를 fiveDayWeather 배열의 형태로 변환
          // slice(0, 5): days에 담긴 "5일치 정보만"을, 배열로 변환
          this.fiveDayWeather = Object.values(days)
            .slice(0, 5)
            .map((day) => {
              return {
                date: this.formatDate(day.date),
                iconUrl: day.iconUrl,
                description: day.description,
                //온도 계산(평균, 최고, 최저)
                avg: day.temps.reduce((a, b) => a + b, 0) / day.temps.length,
                max: Math.max(...day.temps),
                min: Math.min(...day.temps),
              };
            });
            this.loading = false; // 데이터 로드 완료 후 로딩 상태 false로 변경
        })
        .catch((err) => {
          console.log("날씨 api 오류:", err);
          this.loading = false; // 오류 발생 시에도 로딩 상태 false로 변경
        });
    },
  },
  mounted() {
    this.fetchWeather(); // 페이지가 로드될 때 fetchWeather를 호출(버튼X)
  },
};
</script>

<style src="../css/placeMain.css"></style>
