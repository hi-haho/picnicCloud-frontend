<template>
  <div>
    <div class="search-container">
      <!-- Sidebar -->
      <div class="sidebar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="지역 검색"
          @keyup.enter="searchPlaces"
        />
        <button @click="searchPlaces">검색</button>
        <div>
          <h3>분류</h3>
          <button @click="filterByCategory('전시/공연')">전시/공연</button>
          <button @click="filterByCategory('문화관광/명소')">
            문화관광/명소
          </button>
        </div>
        <div>
          <h3>시설</h3>
          <button @click="toggleFacilityFilter('kidsZone')">키즈존</button>
          <button @click="toggleFacilityFilter('freeParking')">
            무료 주차
          </button>
          <button @click="toggleFacilityFilter('chargedParking')">
            유료 주차
          </button>
          <button @click="toggleFacilityFilter('nursingRoom')">수유실</button>
          <button @click="toggleFacilityFilter('strollerRental')">
            유모차 대여
          </button>
        </div>
      </div>

      <!-- Map Container -->
      <div class="map-container">
        <div
          id="mapContainer"
          ref="mapContainer"
          style="width: 100%; height: 100%"
        ></div>
        <!-- 내 위치 버튼 추가 -->
        <button id="current-location-button" @click="moveToCurrentLocation">
          내 위치
        </button>
        <!-- 로딩 화면 -->
        <div v-if="loading" class="spinner-container">
          <div class="spinner"></div>
          <div class="spinner-text">Loading...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/api/api.js';

export default {
  name: "KakaoMap",
  data() {
    return {
      map: null,
      loading: true, // 로딩 상태
      searchQuery: "", // 검색 쿼리
      facilities: [], // 시설 목록
      categoryFilter: null, // 카테고리 필터
      facilityFilters: [], // 시설 필터 배열
      markers: {}, // 지도에 표시된 마커들을 시설 id로 저장하는 객체
      infoWindow: null, // 단일 인포윈도우 객체를 사용
      activeMarker: null, // 현재 활성화된 마커
      isMouseOverInfoWindow: false, // 인포윈도우 위에 마우스가 있는지 여부
      infoWindowTimer: null, // 인포윈도우 타이머
      ps: null, // 장소 검색 객체
    };
  },
  mounted() {
    this.loadKakaoMap();
  },
  methods: {
    loadKakaoMap() {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.VUE_APP_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`;
      script.onload = () => {
        window.kakao.maps.load(() => {
          this.initializeMap();
        });
      };
      document.head.appendChild(script);
    },
    initializeMap() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const locPosition = new window.kakao.maps.LatLng(lat, lng);

            const container = this.$refs.mapContainer;
            const options = {
              center: locPosition,
              level: 3, // 기본 줌 레벨을 3으로 설정 (100m 축척)
              minLevel: 2, // 최소 줌 레벨을 2으로 설정 (50m 축척)
              maxLevel: 4, // 최대 줌 레벨을 4으로 설정
            };
            this.map = new window.kakao.maps.Map(container, options);

            // 장소 검색 객체 생성
            this.ps = new window.kakao.maps.services.Places();

            // 단일 인포윈도우 객체 생성
            this.infoWindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });

            // 주변 시설 마커 추가
            this.fetchFacilitiesAndAddMarkers();

            // 지도 이동 및 줌 변경 시 마커 업데이트
            window.kakao.maps.event.addListener(
              this.map,
              "idle",
              this.updateMarkers
            );
          },
          (error) => {
            console.error("Geolocation error:", error);
            const defaultPosition = new window.kakao.maps.LatLng(
              37.5665,
              126.978
            );
            const container = this.$refs.mapContainer;
            const options = {
              center: defaultPosition,
              level: 3, // 기본 줌 레벨을 3으로 설정 (100m 축척)
              minLevel: 2, // 최소 줌 레벨을 2으로 설정 (50m 축척)
              maxLevel: 4, // 최대 줌 레벨을 4으로 설정
            };
            this.map = new window.kakao.maps.Map(container, options);

            // 장소 검색 객체 생성
            this.ps = new window.kakao.maps.services.Places();

            // 단일 인포윈도우 객체 생성
            this.infoWindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });

            this.fetchFacilitiesAndAddMarkers();

            // 지도 이동 및 줌 변경 시 마커 업데이트
            window.kakao.maps.event.addListener(
              this.map,
              "idle",
              this.updateMarkers
            );
          }
        );
      } else {
        alert("현재 위치를 사용할 수 없습니다.");
      }
    },
    searchPlaces() {
      if (!this.searchQuery.trim()) {
        return;
      }

      // 장소 검색
      this.ps.keywordSearch(this.searchQuery, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const bounds = new window.kakao.maps.LatLngBounds();
          data.forEach((place) => {
            const placePosition = new window.kakao.maps.LatLng(
              place.y,
              place.x
            );
            bounds.extend(placePosition);
          });

          // 검색된 장소들에 맞게 지도의 중심과 확대/축소를 조정
          this.map.setBounds(bounds);
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          alert("검색 결과가 없습니다.");
        } else {
          alert("검색 중 오류가 발생했습니다.");
        }
      });
    },
    fetchFacilitiesAndAddMarkers() {
      apiClient
        .get("/facilities-map")
        .then((response) => {
          this.facilities = response.data;
          this.loading = false; // 로딩 완료
          this.updateMarkers(); // 초기 마커 표시
        })
        .catch((error) => {
          console.error("Error fetching facilities:", error);
          this.loading = false; // 로딩 완료 (오류 발생 시에도)
        });
    },
    updateMarkers() {
      const bounds = this.map.getBounds(); // 현재 뷰포트 범위 가져오기
      const extendedBounds = new window.kakao.maps.LatLngBounds(
        new window.kakao.maps.LatLng(
          bounds.getSouthWest().getLat() -
            (bounds.getNorthEast().getLat() - bounds.getSouthWest().getLat()) *
              0.1,
          bounds.getSouthWest().getLng() -
            (bounds.getNorthEast().getLng() - bounds.getSouthWest().getLng()) *
              0.1
        ),
        new window.kakao.maps.LatLng(
          bounds.getNorthEast().getLat() +
            (bounds.getNorthEast().getLat() - bounds.getSouthWest().getLat()) *
              0.1,
          bounds.getNorthEast().getLng() +
            (bounds.getNorthEast().getLng() - bounds.getSouthWest().getLng()) *
              0.1
        )
      );

      const filteredFacilities = this.categoryFilter
        ? this.facilities.filter(
            (facility) => facility.category === this.categoryFilter
          )
        : this.facilities;

      const furtherFilteredFacilities =
        this.facilityFilters.length > 0
          ? filteredFacilities.filter((facility) =>
              this.facilityFilters.every((filter) => facility[filter] === true)
            )
          : filteredFacilities;

      // 빨간색 마커 이미지 (전시/공연)
      const redMarkerImage = new window.kakao.maps.MarkerImage(
        "data:image/svg+xml;base64," +
          btoa(
            `<svg width="24" height="35" xmlns="http://www.w3.org/2000/svg"><path fill="#FF6347" d="M12 0C5.4 0 0 5.4 0 12c0 7.5 12 23 12 23s12-15.5 12-23C24 5.4 18.6 0 12 0z"/><circle fill="#000000" cx="12" cy="12" r="4"/></svg>`
          ),
        new window.kakao.maps.Size(24, 35)
      );

      // 하늘색 마커 이미지 (문화관광/명소)
      const blueMarkerImage = new window.kakao.maps.MarkerImage(
        "data:image/svg+xml;base64," +
          btoa(
            `<svg width="24" height="35" xmlns="http://www.w3.org/2000/svg"><path fill="#87CEEB" d="M12 0C5.4 0 0 5.4 0 12c0 7.5 12 23 12 23s12-15.5 12-23C24 5.4 18.6 0 12 0z"/><circle fill="#000000" cx="12" cy="12" r="4"/></svg>`
          ),
        new window.kakao.maps.Size(24, 35)
      );

      furtherFilteredFacilities.forEach((facility) => {
        const markerPosition = new window.kakao.maps.LatLng(
          facility.latitude,
          facility.longitude
        );

        if (extendedBounds.contain(markerPosition)) {
          if (!this.markers[facility.id]) {
            const markerImage =
              facility.category === "전시/공연"
                ? redMarkerImage
                : blueMarkerImage;

            const marker = new window.kakao.maps.Marker({
              position: markerPosition,
              image: markerImage,
            });

            this.markers[facility.id] = marker;

            window.kakao.maps.event.addListener(marker, "click", () => {
              this.displayInfoWindow(facility, marker);
            });

            marker.setMap(this.map);
          }
        }
      });
    },
    clearMarkers() {
      Object.values(this.markers).forEach((marker) => {
        marker.setMap(null); // 모든 마커를 지도에서 제거
      });
      this.markers = {}; // 마커 객체 초기화
    },
    displayInfoWindow(facility, marker) {
      const homepageLink = facility.homepageUrl
        ? `<p><strong>홈페이지:</strong> <a href="${facility.homepageUrl}" target="_blank" style="color:#007BFF; text-decoration:none;">${facility.homepageUrl}</a></p>`
        : "";
      const content = `
        <div id="info-window-content" style="padding:10px;">
          <h4>${facility.name}</h4>
          <p><strong>주소:</strong> ${facility.address}</p>
          <p><strong>전화번호:</strong> ${facility.telephone}</p>
          <p><strong>운영 시간:</strong> ${facility.operationTime}</p>
          ${homepageLink}
          <p><strong>설명:</strong> ${facility.description}</p>
        </div>
      `;

      this.infoWindow.setContent(content);
      this.infoWindow.open(this.map, marker);
      this.activeMarker = marker;

      const infoWindowElement = document.getElementById("info-window-content");
      if (infoWindowElement) {
        infoWindowElement.addEventListener("mouseover", () => {
          if (this.infoWindowTimer) {
            clearTimeout(this.infoWindowTimer);
          }
          this.isMouseOverInfoWindow = true;
        });

        infoWindowElement.addEventListener("mouseout", () => {
          this.isMouseOverInfoWindow = false;
          this.infoWindowTimer = setTimeout(() => {
            this.infoWindow.close();
          }, 200);
        });
      }

      window.kakao.maps.event.addListener(marker, "mouseout", () => {
        this.infoWindowTimer = setTimeout(() => {
          if (!this.isMouseOverInfoWindow) {
            this.infoWindow.close();
          }
        }, 200);
      });
    },
    moveToCurrentLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const locPosition = new window.kakao.maps.LatLng(lat, lng);

          this.map.setCenter(locPosition);
        });
      } else {
        alert("현재 위치를 사용할 수 없습니다.");
      }
    },
    filterByCategory(category) {
      if (this.categoryFilter === category) {
        this.categoryFilter = null;
      } else {
        this.categoryFilter = category;
        this.facilityFilters = [];
      }
      this.clearMarkers();
      this.updateMarkers();
    },
    toggleFacilityFilter(facilityType) {
      const index = this.facilityFilters.indexOf(facilityType);
      if (index === -1) {
        this.facilityFilters.push(facilityType);
      } else {
        this.facilityFilters.splice(index, 1);
      }
      this.clearMarkers();
      this.updateMarkers();
    },
  },
};
</script>

<style src="../css/mapStyle.css"></style>
