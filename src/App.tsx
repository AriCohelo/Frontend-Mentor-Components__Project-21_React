import './app.scss';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import arrowIcon from './assets/icon-arrow.svg';

type FormValues = {
  day: number;
  month: number;
  year: number;
};

function isValidDate(day: number, month: number, year: number): boolean {
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}
function calculateResults(day: number, month: number, year: number) {
  const date = new Date();
  let yearResult = date.getFullYear() - year;
  let monthResult = date.getMonth() + 1 - month;
  let dayResult = date.getDate() - day;

  if (monthResult < 0) {
    yearResult -= 1;
    monthResult += 12;
  }

  if (dayResult < 0) {
    monthResult -= 1;
    const previousMonthDate = new Date(date.getFullYear(), date.getMonth(), 0);
    const daysInPreviousMonth = previousMonthDate.getDate();
    dayResult += daysInPreviousMonth;
  }

  return { yearResult, monthResult, dayResult };
}
function App() {
  const form = useForm<FormValues>();
  const { register, handleSubmit, formState, getValues } = form;
  const { errors } = formState;
  const [resultMonths, setResultMonths] = useState<number | undefined>();
  const [resultYears, setResultYears] = useState<number | undefined>();
  const [resultDays, setResultDays] = useState<number | undefined>();

  const onSubmit = (data: FormValues) => {
    const { yearResult, monthResult, dayResult } = calculateResults(
      data.day,
      data.month,
      data.year
    );
    setResultMonths(monthResult);
    setResultYears(yearResult);
    setResultDays(dayResult);
  };

  return (
    <>
      <div className="calcContainer">
        <form
          className="calcContainer__form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="day" className="calcContainer__form-label">
            DAY
          </label>
          <input
            type="number"
            id="day"
            className="calcContainer__form-input"
            {...register('day', {
              valueAsNumber: true,
              required: 'This field is required',
              min: {
                value: 1,
                message: 'Must be a valid day',
              },
              max: {
                value: 31,
                message: 'Must be a valid day',
              },
              validate: (value) => {
                const day = value;
                const month = getValues('month');
                const year = getValues('year');
                return isValidDate(day, month, year) || 'Invalid date';
              },
            })}
            placeholder="DD"
          />
          <p className="calcContainer__form-error">{errors.day?.message}</p>

          <label htmlFor="month" className="calcContainer__form-label">
            MONTH
          </label>
          <input
            type="number"
            id="month"
            className="calcContainer__form-input"
            {...register('month', {
              valueAsNumber: true,
              required: 'This field is required',
              min: {
                value: 1,
                message: 'Must be a valid month',
              },
              max: {
                value: 12,
                message: 'Must be a valid month',
              },
              validate: (value) => {
                const day = getValues('day');
                const month = value;
                const year = getValues('year');
                return isValidDate(day, month, year) || 'Invalid date';
              },
            })}
            placeholder="MM"
          />
          <p className="calcContainer__form-error">{errors.month?.message}</p>

          <label htmlFor="year" className="calcContainer__form-label">
            YEAR
          </label>
          <input
            type="number"
            id="year"
            className="calcContainer__form-input"
            {...register('year', {
              valueAsNumber: true,
              required: 'This field is required',
              min: {
                value: 0,
                message: 'Must be a valid year',
              },
              validate: (value) => {
                const day = getValues('day');
                const month = getValues('month');
                const year = value;
                return isValidDate(day, month, year) || 'Invalid date';
              },
            })}
            placeholder="YYYY"
          />
          <p className="calcContainer__form-error">{errors.year?.message}</p>
          <button className="calcContainer__form-submitButton">
            <img
              className="calcContainer__form-arrowIcon"
              src={arrowIcon}
              alt="arrow"
            />
          </button>
        </form>
        <p className="calcContainer__resultYears">
          <span className="calcContainer__resultYears-highlight">
            {resultYears !== undefined ? resultYears : '--'}
          </span>
          &nbsp;years
        </p>
        <p className="calcContainer__resultMonths">
          <span className="calcContainer__resultMonths-highlight">
            {resultMonths !== undefined ? resultMonths : '--'}
          </span>
          &nbsp;months
        </p>
        <p className="calcContainer__resultDays">
          <span className="calcContainer__resultDays-highlight">
            {resultDays !== undefined ? resultDays : '--'}
          </span>
          &nbsp;days
        </p>
      </div>
    </>
  );
}

export default App;
