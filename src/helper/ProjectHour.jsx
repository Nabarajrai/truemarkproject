import moment from "moment";

export const hour = (data, startDate, endDate) => {
  const filtereData = data.filter(
    item =>
      moment(item.start_time).isBetween(startDate, endDate) &&
      moment(item.end_time).isBetween(startDate, endDate)
  );
  return filtereData
    .reduce((acc, item) => {
      return acc + secondsToHours(item.duration_seconds);
    }, 0)
    .toFixed(2);
};

export const secondsToHours = seconds => {
  return +seconds / 3600;
};

export const getDataByName = (data, name) => {
  return data.filter(item => item.workers === name);
};

export const getDataByProject = (data, project) => {
  return data.filter(item => item.project === project);
};

export const getWorkersName = data => {
  const names = data.map(item => item.workers);
  return [...new Set(names)];
};

export const roundValue = value => {
  return Math.round(value);
};
