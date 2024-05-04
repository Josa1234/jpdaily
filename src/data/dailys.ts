import localforage from "localforage";

const storage = localforage.createInstance({
  name: "dataDailys",
});

interface Daily {
  id: number;
  title: string;
  notes: string;
  timeReminder: string;
  isDone: boolean;
}

export function getDataDailys(): Promise<Daily[]> {
  return storage
    .getItem<Daily[]>("dailys")
    .then((data: Daily[] | null) => data || []);
}

export function searchDailys(keyword: string): Promise<Daily[]> {
  return getDataDailys().then((dataDailys) => {
    const filteredDataDailys = dataDailys.filter((daily) =>
      daily.title.toLowerCase().includes(keyword.toLowerCase())
    );
    return filteredDataDailys;
  });
}

export function getDataDailyById(id: number): Promise<Daily | undefined> {
  return getDataDailys().then((dataDailys) => {
    const foundDataDaily = dataDailys.find((daily) => daily.id === id);
    return foundDataDaily;
  });
}

export function updateDataDaily(
  id: number,
  updates: Partial<Daily>
): Promise<Daily> {
  return getDataDailys().then((dataDailys) => {
    const index = dataDailys.findIndex((daily) => daily.id === id);
    if (index === -1) throw new Error("No contact found for" + id);

    const updatedDaily: Daily = { ...dataDailys[index], ...updates };

    updatedDaily.timeReminder =
      updates.timeReminder || dataDailys[index].timeReminder;
    updatedDaily.isDone = updates.isDone ?? dataDailys[index].isDone;

    dataDailys[index] = updatedDaily;

    return storage.setItem("dailys", dataDailys).then(() => updatedDaily);
  });
}

export function addNewDataDaily({
  title,
  notes,
  isDone,
}: {
  title: string;
  notes: string;
  isDone: boolean;
}): Promise<void> {
  return getDataDailys().then((dataDailys) => {
    const lastId =
      dataDailys.length > 0 ? dataDailys[dataDailys.length - 1].id : 0;
    const newDaily: Daily = {
      id: lastId + 1,
      title,
      notes,
      timeReminder: "3.00",
      isDone,
    };
    dataDailys.push(newDaily);
    return storage.setItem("dailys", dataDailys).then(() => {
      console.log({ title, isDone });
    });
  });
}

export function deleteDataDailyById(id: number): Promise<boolean> {
  return storage
    .getItem<Daily[]>("dailys")
    .then((dataDailys) => {
      if (dataDailys === null) {
        return false;
      }
      const index = dataDailys.findIndex((daily) => daily.id === id);
      if (index > -1) {
        dataDailys.splice(index, 1);
        return storage.setItem("dailys", dataDailys).then(() => true);
      }
      return false;
    })
    .catch((error) => {
      console.error("Error deleting daily data:", error);
      return false;
    });
}
