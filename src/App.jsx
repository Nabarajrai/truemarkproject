import { useMemo, useState } from "react";
import FileUpload from "./FileUpload";
import TabularReport from "./TabularReport";
import "./App.css";
import CustomInput from "./components/CustomInput";
import SelectInput from "./components/SelectInput";
import {
  getDataByName,
  getDataByProject,
  getWorkersName,
  hour,
} from "./helper/ProjectHour";
import moment from "moment";
import { RxCross2 } from "react-icons/rx";

const daily = [
  {
    label: "Weekly",
    value: "weekly",
  },
  {
    label: "Bi-weekly",
    value: "bi-weekly",
  },
  {
    label: "Monthly",
    value: "monthly",
  },
  {
    label: "Bi-monthly",
    value: "bi-monthly",
  },
];
const HOURLY_RATE = 24;

const INITIAL_VALUE = {
  startDate: "2019-09-01T17:57:58+05:45",
  endDate: "2019-09-21T17:58:05+05:45",
};

const App = () => {
  const [csvData, setCSVData] = useState([]);
  const [formFields, setFormFields] = useState(INITIAL_VALUE);
  const [frequency, setFrequency] = useState("weekly");
  const [selectedProjects, setSelectedProjects] = useState([]);
  const handleChange = e => {
    const { name, value } = e.target;
    setFormFields({ ...formFields, [name]: value });
  };
  const { startDate, endDate } = formFields;
  const handleFileUpload = data => {
    setCSVData(data);
  };
  const handleSelect = e => {
    if (selectedProjects.includes(e.target.value)) return;
    setSelectedProjects(old => [...old, e.target.value]);
  };

  const handleSelectDay = e => {
    setFrequency(e.target.value);
  };

  const handleDelete = project => {
    setSelectedProjects(old => old.filter(p => p !== project));
  };

  const timeGroups = useMemo(() => {
    const momentStartDate = moment(formFields.startDate);
    const momentEndDate = moment(formFields.endDate);
    const groups = [];
    const timePeriod = ["weekly", "bi-weekly"].includes(frequency)
      ? "week"
      : "month";
    const timePeriodCount = frequency?.includes("bi") ? 2 : 1;
    let nextEndDate = moment(momentStartDate)
      .add(timePeriodCount, timePeriod)
      .subtract(1, "day");
    let nextStartDate = momentStartDate;

    /**
     * jul 01 - jul 07
     * jul 08 - jul 14
     */
    while (nextEndDate.isSameOrBefore(momentEndDate)) {
      let label = "";
      if (frequency.includes("week")) {
        label =
          moment(nextStartDate).format("MMM DD") +
          " - " +
          moment(nextEndDate).format("MMM DD");
      } else {
        label = moment(nextStartDate).format("MMM");
      }
      groups.push({
        label: label,
        startDate: nextStartDate,
        endDate: nextEndDate,
      });

      nextStartDate = moment(nextEndDate).add(1, "day");
      nextEndDate = moment(nextEndDate).add(timePeriodCount, timePeriod);
    }

    return groups;
  }, [frequency, formFields]);

  const displayData = useMemo(() => {
    const workers = getWorkersName(csvData);
    const orderedData = workers.reduce((acc, item) => {
      const perPersonData = getDataByName(csvData, item);
      const projectData = selectedProjects.reduce((acc, item, index) => {
        const perProjectData = getDataByProject(perPersonData, item);
        const isFirstIndex = index === 0;
        const totalHours = 20;

        const dynamicFields = timeGroups.reduce((acc, item, index) => {
          return {
            ...acc,
            [`filter${index}`]: hour(
              perProjectData,
              item.startDate,
              item.endDate
            ),
          };
        }, {});

        const projectHours = Object.values(dynamicFields).reduce(
          (acc, item) => acc + +item,
          0
        );
        const projectcost = HOURLY_RATE * projectHours;

        const newObject = {
          name: isFirstIndex ? perPersonData[0].workers : null,
          hourlyRate: isFirstIndex ? HOURLY_RATE : null,
          project: item,
          projectHours: projectHours,
          totalHours: null,
          projectCost: projectcost?.toFixed(2),
          totalCost: isFirstIndex ? totalHours * HOURLY_RATE : null,
          ...dynamicFields,
        };
        return [...acc, newObject];
      }, []);
      const totalHours = projectData.reduce(
        (acc, item) => acc + +item.projectHours,
        0
      );
      if (projectData[0]) {
        projectData[0].totalHours = totalHours;
      }

      return [...acc, ...projectData];
    }, []);
    return orderedData;
  }, [csvData, selectedProjects, timeGroups]);
  const projectOptions = useMemo(() => {
    const projects = csvData.map(d => d.project);
    return [...new Set(projects)].map(project => ({
      label: project,
      value: project,
    }));
  }, [csvData]);

  const totalValues = useMemo(() => {
    return selectedProjects.map(project => {
      const projectRows = displayData.filter(d => d.project === project);
      const projectHours = projectRows.reduce(
        (acc, row) => acc + +row.projectHours,
        0
      );
      const projectCost = projectRows.reduce(
        (acc, row) => acc + +row.projectCost,
        0
      );
      const totalHours = projectRows.reduce((acc, row) => {
        if (typeof row.totalHours === "number") {
          return acc + +row.totalHours;
        }
        return acc;
      }, 0);
      const totalCost = projectRows.reduce((acc, row) => {
        if (typeof row.totalCost === "number") {
          return acc + +row.totalCost;
        }
        return acc;
      }, 0);
      const dynamicFields = timeGroups.reduce((acc, item, index) => {
        const total = projectRows.reduce((acc, item) => {
          return acc + +item[`filter${index}`];
        }, 0);
        return {
          ...acc,
          [`filter_total${index}`]: total.toFixed(2),
        };
      }, {});

      return {
        project: project,
        projectHours: projectHours.toFixed(2),
        projectCost: projectCost?.toFixed(2),
        totalHours: totalHours.toFixed(2),
        totalCost: totalCost.toFixed(2),
        ...dynamicFields,
      };
    });
  }, [selectedProjects, displayData, timeGroups]);

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Workers Time Tracker</h1>
        <div className="file-upload">
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
      </div>

      <div className="filter-section">
        <CustomInput
          type="date"
          inputType="date"
          placeholder="Start-date"
          name="startDate"
          onChange={e => handleChange(e)}
          value={startDate}
        />
        <CustomInput
          type="date"
          inputType="date"
          placeholder="End-date"
          name="endDate"
          onChange={e => handleChange(e)}
          value={endDate}
        />
        <SelectInput data={daily} onChange={e => handleSelectDay(e)} />
        <SelectInput
          data={projectOptions}
          type="project"
          onChange={e => handleSelect(e)}
        />
      </div>
      <div className="filter-data">
        {selectedProjects.map((data, i) => (
          <span
            className="filter-items"
            key={i}
            onClick={() => handleDelete(data)}
          >
            {data}{" "}
            <span className="filter-icon">
              <RxCross2 />
            </span>
          </span>
        ))}
      </div>

      <TabularReport
        data={displayData}
        filter={selectedProjects}
        total={totalValues}
        dynamicColumns={timeGroups}
      />
    </div>
  );
};

export default App;
