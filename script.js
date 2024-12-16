document.addEventListener("DOMContentLoaded", () => {
  let musicList = [];
  let newMusicList = [];

  fetch("https://music-api-633027138758.asia-east1.run.app/api/music")
    .then((res) => {
      const data = res.json();
      return data;
    })
    .then((data) => {
      console.log(data);
      musicList.push(...data);
      updateDOM(musicList);
    });

  function updateDOM(musicList) {
    const audio = document.querySelector("#audio");
    const selectElement = document.querySelector("#selectElement");
    const playStopBtn = document.querySelector("#playStopBtn");
    const replayBtn = document.querySelector("#replayBtn");
    const prevTime = document.querySelector("#prevTime");
    const prevSong = document.querySelector("#prevSong");
    const nextSong = document.querySelector("#nextSong");
    const nextTime = document.querySelector("#nextTime");
    const setMute = document.querySelector("#setMute");
    const buttons = document.querySelectorAll(".nbtn");
    const tool = document.querySelector("#tool");
    const setVolume = document.querySelector("#setVolume");
    const clickVolumeUp = document.querySelector("#clickVolumeUp");
    const clickVolumeDown = document.querySelector("#clickVolumeDown");
    const showVolume = document.querySelector("#showVolume");
    const showNowTime = document.querySelector("#showNowTime");
    const showSongTime = document.querySelector("#showSongTime");
    const showDetailText = document.querySelector("#showDetailText");
    const progressBar = document.querySelector("#progressBar");
    const showStatus = document.querySelector("#showStatus");
    const closePopList = document.querySelector("#closePopList");
    const overlayList = document.querySelector("#overlayList");
    const popupList = document.querySelector("#popupList");
    const sinGer = document.querySelector("#sinGer");
    const favicon = document.querySelector("#favicon");
    const cover = document.querySelector("#cover");
    const addPopList = document.querySelector("#addPopList");
    const popupWindow = document.querySelector("#popupWindow");
    const overlayTool = document.querySelector("#overlayTool");
    const setTool = document.querySelector("#setTool");
    const closePopTool = document.querySelector("#closePopTool");
    const closePopSet = document.querySelector("#closePopSet");
    const popupTool = document.querySelector("#popupTool");
    const closePop = document.querySelector("#closePop");
    const closePopPly = document.querySelector("#closePopPly");

    let selectedId = 0;
    audio.src = musicList[selectedId].src;
    let singer = "";
    let temp = "";
    let wasMute = false;
    let wasPlaying = false;
    let currentMode = "orderSong";
    let doubleMode = "";
    let repeatMode = false;
    let ranIndex = 0;
    let iconIndex = 0;

    musicListFun();
    function musicListFun() {
      selectElement.innerHTML = "";
      musicList.forEach((song, index) => {
        const option = document.createElement("option");
        option.value = index;
        selectElement.value = option.value;
        option.textContent = song.title;
        selectElement.appendChild(option);
      });
    }

    getSinger();
    function getSinger() {
      singer = musicList[selectElement.value].singer;
      sinGer.innerHTML = singer;
      temp = musicList[selectElement.value].src;
      document.title = `playWeb ${musicList[selectElement.value].title}`;
      favicon.href = `${musicList[selectElement.value].Thumbnail}`;
      cover.src = `${musicList[selectElement.value].Thumbnail}`;
    }

    function checkPlay() {
      if (wasPlaying) {
        play();
      }
    }

    selectElement.addEventListener("change", function (event) {
      selectedId = parseInt(event.target.value);
      audio.src = musicList[selectedId].src;
      checkPlay();
      getSinger();
    });

    setVolumeFun();
    function setVolumeFun() {
      const min = setVolume.min;
      const max = setVolume.max;
      const value = setVolume.value;
      const percentage = ((value - min) / (max - min)) * 100;
      setVolume.style.background = `linear-gradient(to right, #5fc3b4  ${percentage}%, #8F8F8F ${percentage}%)`;
      audio.volume = setVolume.value / 100;
      showVolume.value = setVolume.value;
      mute();
    }

    function mute() {
      if (audio.muted || audio.volume == 0) {
        setMute.setAttribute("class", "fa-solid fa-volume-xmark fa-2x mbtn");
      } else {
        setMute.setAttribute("class", "fa-solid fa-volume-up fa-2x mbtn");
      }
    }

    setMute.addEventListener("click", function () {
      wasMute = audio.muted;
      audio.muted = !audio.muted;
      mute();
    });

    setVolume.addEventListener("input", setVolumeFun);
    function setVolumeClick(n) {
      setVolume.value = Math.min(
        100,
        Math.max(0, parseInt(setVolume.value) + n)
      );
      setVolumeFun();
    }

    clickVolumeUp.addEventListener("click", function () {
      setVolumeClick(5);
    });

    clickVolumeDown.addEventListener("click", function () {
      setVolumeClick(-5);
    });

    function getMusicTime() {
      showNowTime.innerText = getTimeFormat(audio.currentTime);
      showSongTime.innerText = getTimeFormat(audio.duration);
      progressBar.value = audio.currentTime;
      const percentage = (audio.currentTime / audio.duration) * 100;
      progressBar.style.background = `linear-gradient(to right, #5fc3b4 ${percentage}%, #8F8F8F ${percentage}%)`;
    }

    function getTimeFormat(t) {
      let m = parseInt(t / 60);
      let s = parseInt(t % 60);
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      return m + ":" + s;
    }

    function setProgress() {
      const min = progressBar.min;
      const max = progressBar.max;
      const value = progressBar.value;
      const percentage = ((value - min) / (max - min)) * 100;
      progressBar.style.background = `linear-gradient(to right, #5fc3b4  ${percentage}%, #8F8F8F ${percentage}%)`;
      audio.currentTime = progressBar.value;
    }

    audio.addEventListener("loadedmetadata", function () {
      progressBar.max = audio.duration;
    });

    progressBar.addEventListener("input", setProgress);

    function updatePlayStatus() {
      wasPlaying = !audio.paused;
    }

    function stop() {
      playStopBtn.src = "icon_img/icon_play.svg";
      showDetailText.innerText = "已暫停";
      audio.pause();
      updatePlayStatus();
      stopTracking();
    }

    function play() {
      playStopBtn.src = "icon_img/icon_pause.svg";
      if (currentMode === "randomSong") {
        singer = musicList[selectElement.value].singer;
        sinGer.innerHTML = musicList[indices[ranIndex]].singer;
      } else {
        getSinger();
      }
      showDetailText.innerText = `播放中`;
      audio.addEventListener("timeupdate", getMusicTime);
      audio.play();
      updatePlayStatus();
      isTrackingFun();
    }

    playStopBtn.addEventListener("click", function () {
      if (audio.paused) {
        play();
      } else {
        stop();
      }
    });

    replayBtn.addEventListener("click", function () {
      stop();
      audio.currentTime = 0;
    });

    function changeTime(s) {
      audio.currentTime += s;
    }

    prevTime.addEventListener("click", function () {
      changeTime(-10);
    });
    nextTime.addEventListener("click", function () {
      changeTime(10);
    });

    prevSong.addEventListener("click", function () {
      if (currentMode == "randomSong") {
        if (doubleMode == "randomSongAndRePeat" && ranIndex <= 0) {
          ranIndex = indices.length - 1;
          audio.src = musicList[indices[ranIndex]].src;
          selectElement.value = indices[ranIndex];
          getSinger();
        } else if (ranIndex <= 0) {
          ranIndex = 0;
        } else {
          ranIndex -= 1;
          audio.src = musicList[indices[ranIndex]].src;
          selectElement.value = indices[ranIndex];
          getSinger();
        }
      } else {
        if (doubleMode == "orderSongAndRePeat" && selectedId <= 0) {
          selectedId = musicList.length - 1;
          audio.src = musicList[selectedId].src;
          selectElement.value = selectedId;
          getSinger();
        } else if (selectedId <= 0) {
          selectedId = 0;
        } else {
          selectedId -= 1;
          audio.src = musicList[selectedId].src;
          selectElement.value = selectedId;
          getSinger();
        }
      }
      checkPlay();
    });
    nextSong.addEventListener("click", function () {
      if (currentMode == "randomSong") {
        if (
          doubleMode == "randomSongAndRePeat" &&
          ranIndex + 1 >= indices.length
        ) {
          ranIndex = 0;
          audio.src = musicList[indices[ranIndex]].src;
          selectElement.value = indices[ranIndex];
          getSinger();
        } else if (ranIndex + 1 >= indices.length) {
          ranIndex = indices.length - 1;
        } else {
          ranIndex += 1;
          audio.src = musicList[indices[ranIndex]].src;
          selectElement.value = indices[ranIndex];
          getSinger();
        }
      } else {
        if (
          doubleMode == "orderSongAndRePeat" &&
          selectedId >= musicList.length - 1
        ) {
          selectedId = 0;
          audio.src = musicList[selectedId].src;
          selectElement.value = selectedId;
          getSinger();
        } else if (selectedId >= musicList.length - 1) {
          selectedId = musicList.length - 1;
        } else {
          selectedId += 1;
          audio.src = musicList[selectedId].src;
          selectElement.value = selectedId;
          getSinger();
        }
      }
      checkPlay();
    });

    const iconFun = [
      { icon: "fa-right-long", action: orderSong },
      { icon: "fa-redo", action: repeatSong },
      { icon: "fa-shuffle", action: randomSong },
    ];

    function orderSong() {
      if (repeatMode === false) {
        currentMode = "orderSong";
        showStatus.innerHTML = "依序播放";
      } else {
        currentMode = "orderSong";
        doubleMode = "";
        doubleMode = "orderSongAndRePeat";
        showStatus.innerHTML = "依序循環播放";
      }
    }

    function repeatSong() {
      currentMode = "repeatSong";
      temp = audio.src;
      // console.log(temp);
      showStatus.innerHTML = "單曲重複";
    }

    function randomSong() {
      if (repeatMode === false) {
        currentMode = "randomSong";
        doubleMode = "";
        showStatus.innerHTML = "隨機播放";
      } else {
        currentMode = "randomSong";
        doubleMode = "randomSongAndRePeat";
        showStatus.innerHTML = "隨機循環播放";
      }
      ranSong();
      getSinger();
    }

    function updateButton() {
      if (iconIndex == 0) {
        carouselButton.className = `fa-solid ${iconFun[iconIndex].icon} fa-2x nbtn `;
      } else {
        carouselButton.className = `fa-solid ${iconFun[iconIndex].icon} fa-2x nbtn tbtn`;
      }
    }

    carouselButton.addEventListener("click", () => {
      iconIndex = (iconIndex + 1) % iconFun.length;
      // console.log(iconIndex);
      iconFun[iconIndex].action();
      updateButton();
    });

    const functions = {
      list: () => {
        showPopupList();
        document.addEventListener("click", (event) => {
          if (
            overlayList.style.display === "flex" &&
            !popupList.contains(event.target) &&
            event.target !== list
          ) {
            closePopupList();
          }
        });
      },
      repeatList: () => {
        repeatMode = !repeatMode;
        // console.log(repeatMode);
        if (currentMode == "orderSong") {
          doubleMode = "orderSongAndRePeat";
          showStatus.innerHTML = "依序循環播放";
          if (repeatMode == false) {
            doubleMode = "";
            orderSong();
          }
        } else if (currentMode == "randomSong") {
          doubleMode = "randomSongAndRePeat";
          showStatus.innerHTML = "隨機循環播放";
          if (repeatMode == false) {
            doubleMode = "";
            randomSong();
          }
        }
        const repeatList = document.querySelector("#repeatList");
        if (repeatMode == true) {
          repeatList.setAttribute("class", "fa-solid fa-retweet fa-2x tbtn");
        } else {
          repeatList.setAttribute("class", "fa-solid fa-retweet fa-2x nbtn");
        }
        // console.log(repeatList);
      },
      tool: () => {
        showPopupTool();
        document.addEventListener("click", (event) => {
          if (
            overlayTool.style.display === "flex" &&
            !popupTool.contains(event.target) &&
            event.target !== tool
          ) {
            closePopToolF();
          }
        });
      },
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.id;
        if (functions[id]) {
          functions[id]();
        } else {
          console.error(`未定義的功能：${id}`);
        }
      });
    });

    audio.addEventListener("ended", function () {
      if (currentMode === "repeatSong") {
        audio.src = temp;
        checkPlay();
      } else if (doubleMode == "randomSongAndRePeat") {
        if (ranIndex + 1 >= indices.length) {
          ranIndex = 0;
          audio.src = musicList[indices[ranIndex]].src;
          selectElement.value = indices[ranIndex];
          document.title = `playWeb ${musicList[selectElement.value].title}`;
          play();
        } else {
          ranIndex += 1;
          // console.log(indices[ranIndex]);
          audio.src = musicList[indices[ranIndex]].src;
          selectElement.value = indices[ranIndex];
          document.title = `playWeb ${musicList[selectElement.value].title}`;
          play();
        }
      } else if (doubleMode == "orderSongAndRePeat") {
        if (selectedId + 1 >= musicList.length) {
          selectedId = 0;
          audio.src = musicList[selectedId].src;
          selectElement.value = selectedId;
          play();
        } else {
          defSong();
        }
      } else if (currentMode == "randomSong") {
        if (ranIndex < indices.length) {
          if (ranIndex + 1 == indices.length) {
            stop();
            audio.currentTime = 0;
          } else {
            ranIndex += 1;
            // console.log(indices[ranIndex]);
            audio.src = musicList[indices[ranIndex]].src;
            selectElement.value = indices[ranIndex];
            document.title = `playWeb ${musicList[selectElement.value].title}`;
            play();
          }
        }
      } else if (currentMode == "orderSong") {
        defSong();
      }
    });

    function defSong() {
      if (selectedId == musicList.length - 1) {
        stop();
        audio.currentTime = 0;
      } else {
        selectedId = selectedId + 1;
        audio.src = musicList[selectedId].src;
        selectElement.value = selectedId;
        play();
      }
    }

    let indices;
    function ranSong() {
      indices = Array.from({ length: musicList.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      if (wasPlaying == true) {
      } else {
        end();
      }
    }

    function end() {
      audio.src = musicList[indices[ranIndex]].src;
      selectElement.value = indices[ranIndex];
      singer = musicList[indices[ranIndex]].singer;
      sinGer.innerHTML = singer;
    }

    function showPopupList() {
      overlayList.style.display = "flex";
    }

    function closePopupList() {
      overlayList.style.display = "none";
    }

    closePopList.addEventListener("click", closePopupList);

    addPopList.addEventListener("click", () => {
      alert("您尚未成為訂閱會員，請付費以解鎖更多功能！");
    });

    ListUp();
    function ListUp() {
      const listContainer = document.querySelector("#popupListUp");
      listContainer.innerHTML = "";
      musicList.forEach((song, i) => {
        let contentSong = document.createElement("div");
        let xmark = document.createElement("i");
        let box = document.createElement("div");
        contentSong.id = "contentSong";
        xmark.id = "xmark";
        box.id = "box";
        contentSong.classList.add("contentSong");
        xmark.classList.add("xmark");
        box.classList.add("box");
        contentSong.innerHTML = `<div>${song.title}</div>`;
        xmark.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
        box.appendChild(contentSong);
        box.appendChild(xmark);
        listContainer.appendChild(box);

        xmark.addEventListener("click", () => {
          event.stopPropagation();
          newMusicList.push(musicList[i]);
          musicList.splice(i, 1);
          updateUI();
        });
      });
    }

    ListDown();
    function ListDown() {
      const listContainer = document.querySelector("#popupListDown");
      listContainer.innerHTML = "";
      newMusicList.forEach((song, i) => {
        let contentSong = document.createElement("div");
        let xmark = document.createElement("i");
        let box = document.createElement("div");
        contentSong.id = "contentSong";
        xmark.id = "xmark";
        box.id = "box";
        contentSong.classList.add("contentSong");
        xmark.classList.add("xmark");
        box.classList.add("box");
        contentSong.innerHTML = `<div>${song.title}</div>`;
        xmark.innerHTML = `<i class="fa-solid fa-angle-up"></i>`;
        box.appendChild(contentSong);
        box.appendChild(xmark);
        listContainer.appendChild(box);
        xmark.addEventListener("click", () => {
          event.stopPropagation();
          musicList.push(newMusicList[i]);
          newMusicList.splice(i, 1);
          updateUI();
        });
      });
    }

    function updateUI() {
      ListUp();
      ListDown();
      boxesFun();
      musicListFun();
      getSinger();
    }

    boxesFun();
    function boxesFun() {
      const boxes = document.querySelectorAll(".box");
      boxes.forEach((box) => {
        box.addEventListener("mouseenter", () => {
          const children = box.querySelectorAll("*");
          children.forEach((child) => {
            child.style.color = "#FFD700 ";
          });
        });
        box.addEventListener("mouseleave", () => {
          const children = box.querySelectorAll("*");
          children.forEach((child) => {
            child.style.color = "";
          });
        });
      });
    }

    setMute.addEventListener("mouseenter", () => {
      const rect = setMute.getBoundingClientRect();
      popupWindow.style.top = `${rect.top - popupWindow.offsetHeight}px`;
      popupWindow.style.left = `${
        rect.left + rect.width / 2 - popupWindow.offsetWidth / 2
      }px`;
      popupWindow.classList.remove("hidden");
      popupWindow.classList.add("show");
    });

    setMute.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (!popupWindow.matches(":hover")) {
          popupWindow.classList.remove("show");
          popupWindow.classList.add("hidden");
        }
      }, 100);
    });

    popupWindow.addEventListener("mouseenter", () => {
      popupWindow.classList.remove("hidden");
      popupWindow.classList.add("show");
    });

    popupWindow.addEventListener("mouseleave", () => {
      popupWindow.classList.remove("show");
      popupWindow.classList.add("hidden");
    });

    function showPopupTool() {
      overlayTool.style.display = "flex";
      closePopSet.addEventListener("click", function () {
        time = setTool.value * 1000;
        if (time == 0) {
          setTool.value = "30";
        } else if (time !== 0) {
          closePopToolF();
        }
      });
    }

    function closePopToolF() {
      document.getElementById("overlayTool").style.display = "none";
    }

    closePopTool.addEventListener("click", closePopToolF);

    let timeout;
    let time = 5000;
    let initialPosition = { x: 0, y: 0 };
    let isTracking = false;
    function onTimeDo() {
      showPopup();
      stop();
    }

    function isTrackingFun() {
      if (!isTracking) {
        isTracking = true;
        initialPosition = { x: event.clientX, y: event.clientY };
        timeout = setTimeout(onTimeDo, time);
        window.addEventListener("mousemove", onMouseMoveHandler);
        console.log("mousemove event listener added");
      }
    }

    function stopTracking() {
      isTracking = false;
      clearTimeout(timeout);
      window.removeEventListener("mousemove", onMouseMoveHandler);
      console.log("mousemove event listener removed");
    }

    function onMouseMoveHandler(event) {
      if (isTracking) {
        if (
          initialPosition.x !== event.clientX ||
          initialPosition.y !== event.clientY
        ) {
          initialPosition = { x: event.clientX, y: event.clientY };
          clearTimeout(timeout);
          timeout = setTimeout(onTimeDo, time);
        }
      }
    }

    window.removeEventListener("mousemove", onMouseMoveHandler);

    closePop.addEventListener("click", closePopup);

    closePopPly.addEventListener("click", () => {
      closePopup();
      play();
    });

    function showPopup() {
      document.getElementById("overlay").style.display = "flex";
    }

    function closePopup() {
      document.getElementById("overlay").style.display = "none";
    }
  }
});

//
//
//
//bug
//重複及循環同時 ==> select !== 音源  ====> 已處理
//重播 ==> 切換歌手未更新 ===> 已處理
//初始化後單曲重複 最後一首前按循環無法下一首 ==> 邏輯沒錯、不隸屬任何清單
//單曲循環 => 手動切換到次首 無法單曲循環 ==> 已處理
//隨機循環 => select singer not update 已處理

//待處理
//條整視窗大小無法更新select寬度 ==> 留到RWD ==> 處理
//select彈出視窗
//settimeout for long time ==> 已處理
//playstopbtn hover
//docs
