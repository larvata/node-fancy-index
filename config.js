module.exports = {
  // values: [name | size | date | name_desc | size_desc | date_desc]
  // default: name
  default_sort: 'name_desc',

  // values: [true | false]
  // default: true
  directories_first: true,

  // css_href: '',

  // values: [true | false]
  // default: true
  exact_size: false,

  // default: 50
  name_length: 48,

  // do not implement
  // footer: '',
  // header: '',

  // values: [true | false]
  // default: true
  // show_path: true,

  // value: regex string
  ignore: /^\./,

  // values: [true | false]
  // default: true
  // hide_symlinks: true,

  // values: [true | false]
  // default: false
  localtime: true,

  // %a: Abbreviated name of the day of the week.
  // %A: Full name of the day of the week.
  // %b: Abbreviated month name.
  // %B: Full month name.
  // %d: Day of the month as a decimal number (range 01 to 31).
  // %e: Like %d, the day of the month as a decimal number, but a leading zero is replaced by a space.
  // %F: Equivalent to %Y-%m-%d (the ISO 8601 date format).
  // %H: Hour as a decimal number using a 24-hour clock (range 00 to 23).
  // %I: Hour as a decimal number using a 12-hour clock (range 01 to 12).
  // %k: Hour (24-hour clock) as a decimal number (range 0 to 23); single digits are preceded by a blank.
  // %l: Hour (12-hour clock) as a decimal number (range 1 to 12); single digits are preceded by a blank.
  // %m: Month as a decimal number (range 01 to 12).
  // %M: Minute as a decimal number (range 00 to 59).
  // %p: Either "AM" or "PM" according to the given time value.
  // %P: Like %p but in lowercase: "am" or "pm".
  // %r: Time in a.m. or p.m. notation. Equivalent to %I:%M:%S %p.
  // %R: Time in 24-hour notation (%H:%M).
  // %S: Second as a decimal number (range 00 to 60).
  // %T: Time in 24-hour notation (%H:%M:%S).
  // %u: Day of the week as a decimal, range 1 to 7, Monday being 1.
  // %w: Day of the week as a decimal, range 0 to 6, Monday being 0.
  // %y: Year as a decimal number without a century (range 00 to 99).
  // %Y: Year as a decimal number including the century.
  // default: %Y-%b-%d %H:%M
  time_format: '%Y-%b-%d %H:%M',
};
