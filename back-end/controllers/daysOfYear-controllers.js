const { Op } = require("sequelize");
const moment = require("moment");
const momentJalaali = require("moment-jalaali");
const { col, Sequelize } = require("sequelize");
const DaysOfYear = require("../models/daysOfYear");
const TimeSlot = require("../models/timeSlot");

exports.configDaysOfYear = async (req, res, next) => {
  const {
    startHour,
    startMinute,
    endHour,
    endMinute,
    persons,
    slotDuration,
    day,
    month,
    year,
    shippingCost,
  } = req.body;

  if (
    !startHour ||
    !startMinute ||
    !endHour ||
    !endMinute ||
    !persons ||
    !slotDuration ||
    !day ||
    !month ||
    !year ||
    !shippingCost
  ) {
    return res.status(400).send("Request body is missing or empty");
  }

  let startDate = moment(
    momentJalaali(`${year}/${month}/${day}`, "jYYYY/jMM/jDD").format(
      "YYYY-MM-DD"
    )
  );

  const now = moment(new Date());
  if (startDate.diff(now, "days") < 0) {
    return res.status(420).json({
      msg: "  روز نوبت دهی به درستی تنظیم نشده است .",
    });
  }
  startDate.set({ hour: Number(startHour), minute: Number(startMinute) });

  let endDate = moment(
    momentJalaali(`${year}/${month}/${day}`, "jYYYY/jMM/jDD").format(
      "YYYY-MM-DD"
    )
  );

  endDate.set({ hour: Number(endHour), minute: Number(endMinute) });
  let difHours = endDate.diff(startDate, "minute");

  if (difHours < 0 || difHours === 0) {
    return res.status(421).json({
      msg: "ساعت شروع و پایان نوبت دهی به درستی تنظیم نشده است .",
    });
  }

  const _dateString = momentJalaali(
    `${year}/${month}/${day}`,
    "jYYYY/jMM/jDD"
  ).format("YYYY/MM/DD");

  try {
    const initialDatsOfYear = await DaysOfYear.create({
      date: startDate,
      dateString: _dateString, // It's unique and cann't be repeated and month has 2 digits
      isActive: 1,
      startOfDay: startDate,
      endOfDay: endDate,
      slotDuration: slotDuration,
      shippingCost,
    });

    for (let i = 0; i < difHours; i = i + Number(slotDuration)) {
      await TimeSlot.create({
        active: 1,
        remainingPerson: persons,
        DaysOfYearId: initialDatsOfYear.id,
        startTime: moment(startDate).add(i, "minutes"),
      });
    }
  } catch (error) {
    if (error.errors[0].message == "dateString must be unique") {
      return res.status(422).json({
        msg: "تنظیمات مورد نظر برای سیستم نوبت دهی تکراری می باشد ...",
      });
    }
  }

  return res
    .status(200)
    .json({ msg: "تنظیمات مورد نظر برای سیستم نوبت دهی اعمال شد..." });
};

exports.advancedConfigDaysOfYear = async (req, res, next) => {
  // daysOfWeek = ["0", "0", "0", "0", "0", "0", "0"];
  // every day has a number -> mon=1 thur=2 .. sat=6 sun=0  and  daysOfWeek[0] is for sun , daysOfWeek[1]=mon,...

  const {
    daysOfWeek,
    startHour,
    startMinute,
    endHour,
    endMinute,
    persons,
    slotDuration,
    startDay,
    startMonth,
    startYear,
    endDay,
    endMonth,
    endYear,
    shippingCost,
  } = req.body;

  try {
    if (
      !daysOfWeek ||
      !startHour ||
      !startMinute ||
      !endHour ||
      !endMinute ||
      !persons ||
      !slotDuration ||
      !startDay ||
      !startMonth ||
      !startYear ||
      !endDay ||
      !endMonth ||
      !endYear ||
      !shippingCost
    ) {
      return res.status(400).send("Request body is missing or empty");
    }
    let startDate = moment(
      momentJalaali(
        `${startYear}/${startMonth}/${startDay}`,
        "jYYYY/jMM/jDD"
      ).format("YYYY-MM-DD")
    );
    let endDate = moment(
      momentJalaali(`${endYear}/${endMonth}/${endDay}`, "jYYYY/jMM/jDD").format(
        "YYYY-MM-DD"
      )
    );

    if (endDate.diff(startDate) < 0 || endDate.diff(startDate) === 0) {
      return res.status(420).json({
        msg: " بازه ی زمانی به درستی انتخاب نشده است .",
      });
    }

    const now = moment(new Date());
    if (startDate.diff(now, "days") < 0) {
      return res.status(421).json({
        msg: "  تاریخ شروع و پایان نوبت دهی به درستی تنظیم نشده است .",
      });
    }

    startDate.set({ hour: Number(startHour), minute: Number(startMinute) });
    endDate.set({ hour: Number(endHour), minute: Number(endMinute) });
    let difDays = endDate.diff(startDate, "days") + 1;

    for (let index = 0; index < difDays; index++) {
      let tempDate = moment(startDate).add(index, "d");
      let tempDate2 = moment(startDate).add(index, "d");
      tempDate2.set({ hour: Number(endHour), minute: Number(endMinute) });
      let difHours = tempDate2.diff(tempDate, "minute");

      if (difHours < 0 || difHours === 0) {
        return res.status(422).json({
          msg: "ساعت شروع و پایان نوبت دهی به درستی تنظیم نشده است .",
        });
      }

      let tempDateNumber = new Date(tempDate).getDay();

      let stringDateOfTempDate = moment(tempDate, "jYYYY/jMM/jDD").format(
        "YYYY/MM/DD"
      );

      if (daysOfWeek[tempDateNumber] === "1") {
        try {
          initialDatsOfYear = await DaysOfYear.create({
            date: tempDate,
            dateString: stringDateOfTempDate,
            isActive: 1,
            startOfDay: startDate,
            endOfDay: endDate,
            slotDuration: slotDuration,
            shippingCost,
          });

          for (let i = 0; i < difHours; i = i + Number(slotDuration)) {
            await TimeSlot.create({
              active: 1,
              remainingPerson: persons,
              DaysOfYearId: initialDatsOfYear.id,
              startTime: moment(tempDate).add(i, "minutes"),
            });
          }
        } catch (error) {
          if (error.errors[0].message == "dateString must be unique") {
            return res.status(423).json({
              msg: "تنظیمات مورد نظر برای سیستم نوبت دهی تکراری می باشد .",
            });
          }
        }
      }
    }

    return res
      .status(200)
      .json({ msg: " تنظیمات مورد نظر برای سیستم نوبت دهی اعمال شد ." });
  } catch (error) {
    return res.status(500).json({ msg: "An error occured, try again later" });
  }
};

exports.getDaysOfyear = async (req, res, next) => {
  try {
    const _days = await DaysOfYear.findAll({
      limit: 7,
      where: {
        date: {
          [Op.gte]: new Date().toLocaleDateString(),
        },
      },
      include: [
        {
          model: TimeSlot,
          where: {
            [Op.and]: [
              Sequelize.where(col("startTime"), ">", new Date()),
              {
                remainingPerson: {
                  [Op.gt]: 0,
                },
              },
            ],
          },
        },
      ],
    });
    return res.status(200).json({
      data: _days,
    });
  } catch (error) {
    console.log(error);
  }
};
