const min_url = " https://mp3quran.net/api/v3";
const language = "ar";



async function GetAllReciters() {
  const chooseReciters = document.getElementById("chooseReciters");
  const res = await fetch(`${min_url}/reciters?language=${language}`);
  const date = await res.json();
  date.reciters.forEach((reciters) => {
    chooseReciters.innerHTML += `<option value="${reciters.id}">${reciters.name}</option>`;
  });
  chooseReciters.addEventListener("change", (e) =>
    GetRiwayatByReciters(e.target.value)
  );
}
GetAllReciters();

async function GetRiwayatByReciters(ResID) {
  const chooseRiwayat = document.getElementById("chooseRiwayat");
  chooseRiwayat.innerHTML = `<option value="">اختر الرواية</option>`;
  const res = await fetch(
    `${min_url}/reciters?language=${language}&reciter=${ResID}`
  );
  const date = await res.json();
  const novel = date.reciters[0].moshaf;
  novel.forEach((novel) => {
    chooseRiwayat.innerHTML += `<option value="${novel.id}" data-server="${novel.server}"
     data-list="${novel.surah_list}" >${novel.name}</option>`;
  });
  chooseRiwayat.addEventListener("change", (e) => {
    const selectedOption = chooseRiwayat.options[chooseRiwayat.selectedIndex];
    const DataServer = selectedOption.dataset.server;
    const DataList = selectedOption.dataset.list;

    getSurah(DataServer, DataList);
  });
}

async function getSurah(DataServer, DataList) {
  const chooseSuwar = document.getElementById("chooseSuwar");
  chooseSuwar.innerHTML = `<option value="">اختر السورة</option>`;
  const res = await fetch(`${min_url}/suwar?language=${language}`);
  const date = await res.json();
  const surahNames = date.suwar;
  DataList = DataList.split(",");
  DataList.forEach((surahId) => {
    const padSurah = surahId.padStart(3, "0");
    surahNames.forEach((sura) => {
      if (sura.id == surahId) {
        chooseSuwar.innerHTML += `<option value="${DataServer}/${padSurah}.mp3">${sura.name}</option>`;
      }
    });
  });

  chooseSuwar.addEventListener("change", (e) => {
    const selectedSurah = chooseSuwar.options[chooseSuwar.selectedIndex];
    playSurah(selectedSurah.value);
  });
}

function playSurah(surahMp3) {
  const playSurah = document.getElementById("playSurah");
  playSurah.src = surahMp3;

  if (playSurah.paused) {
    playSurah.play();
  }
}
