var own = {}.hasOwnProperty;

function toJson(value, options = {}) {
  var log =
    options.log === null || options.log === undefined ? true : options.log;
  var comment =
    options.comment === null || options.comment === undefined
      ? "%"
      : options.comment;
  var comments = comment ? (Array.isArray(comment) ? comment : [comment]) : [];
  var delimiter = options.delimiter || ":";
  var forgiving = options.forgiving;
  var propertyOrValues = {};
  var isPropertyValuePair;
  var pairs;

  var lines = value
    .split("\n")
    .map((line) => {
      var commentIndex = -1;
      var index;

      while (++commentIndex < comments.length) {
        index = line.indexOf(comments[commentIndex]);
        if (index !== -1) line = line.slice(0, index);
      }

      return line.trim();
    })
    .filter(Boolean);

  pairs = lines.map(function (value) {
    var values = value.split(delimiter);
    var result = [values.shift().trim()];

    if (values.length > 0) {
      result.push(values.join(delimiter).trim());
    }

    return result;
  });

  pairs.forEach(function (line, index) {
    var currentLineIsPropertyValuePair = line.length === 2;

    if (index === 0) {
      isPropertyValuePair = currentLineIsPropertyValuePair;
    } else if (currentLineIsPropertyValuePair !== isPropertyValuePair) {
      throw new Error(
        "Error at `" +
          line +
          "`: " +
          "Both property-value pairs and array values found. " +
          "Make sure either exists."
      );
    }

    if (own.call(propertyOrValues, line[0])) {
      if (
        !forgiving ||
        (forgiving === true &&
          currentLineIsPropertyValuePair &&
          line[1] !== propertyOrValues[line[0]])
      ) {
        throw new Error(
          "Error at `" +
            line +
            "`: " +
            "Duplicate data found. " +
            "Make sure, in objects, no duplicate properties exist;" +
            "in arrays, no duplicate values."
        );
      }

      if (log) {
        if (forgiving === "fix" && propertyOrValues[line[0]] !== line[1]) {
          console.log(
            "Overwriting `" +
              propertyOrValues[line[0]] +
              "` " +
              "to `" +
              line[1] +
              "` for `" +
              line[0] +
              "`"
          );
        } else {
          console.log("Ignoring duplicate key for `" + line[0] + "`");
        }
      }
    }

    propertyOrValues[line[0]] = line[1];
  });

  if (isPropertyValuePair) {
    pairs.sort(sortOnFirstIndex);
    return Object.fromEntries(pairs);
  }

  return lines.sort();
}

function sortOnFirstIndex(a, b) {
  return a[0].charCodeAt(0) - b[0].charCodeAt(0);
}
module.exports = toJson;
