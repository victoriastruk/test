const fs = require('fs');
const readline = require('readline');
const filePath = './10m.txt';

async function quickSort(arr, left, right) {
    if (left >= right) return;

    const pivot = arr[Math.floor((left + right) / 2)];
    let i = left;
    let j = right;

    while (i <= j) {
        while (arr[i] < pivot) {
            i++;
        }
        while (arr[j] > pivot) {
            j--;
        }
        if (i <= j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            i++;
            j--;
        }
    }

    quickSort(arr, left, j);
    quickSort(arr, i, right);
}

async function readFileLineByLine(filePath) {
    const stream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    let maxLengthIncreasing = 1;
    let currentLengthIncreasing = 1;
    let maxStartIndexIncreasing = 0;
    let startIndexIncreasing = 0;
    let longestIncreasing = [];

    let maxLengthDecreasing = 1;
    let currentLengthDecreasing = 1;
    let maxStartIndexDecreasing = 0;
    let startIndexDecreasing = 0;
    let longestDecreasing = [];

    let sum = 0;
    let count = 0;
    let min = Infinity;
    let max = -Infinity;

    let prev = null;
    let nums = [];

    for await (const line of rl) {
        const num = Number(line);
        nums.push(num);
        sum += num;
        count++;

        if (num < min) min = num;
        if (num > max) max = num;

        if (prev !== null) {
            if (num > prev) {
                currentLengthIncreasing++;
                if (currentLengthIncreasing >= maxLengthIncreasing) {
                    if (currentLengthIncreasing > maxLengthIncreasing) {
                        maxLengthIncreasing = currentLengthIncreasing;
                        maxStartIndexIncreasing = startIndexIncreasing;
                        longestIncreasing = [nums.slice(startIndexIncreasing, count)];
                    } else {
                        longestIncreasing.push(nums.slice(startIndexIncreasing, count));
                    }
                }
            } else {
                currentLengthIncreasing = 1;
                startIndexIncreasing = count - 1;
            }

            if (num < prev) {
                currentLengthDecreasing++;
                if (currentLengthDecreasing >= maxLengthDecreasing) {
                    if (currentLengthDecreasing > maxLengthDecreasing) {
                        maxLengthDecreasing = currentLengthDecreasing;
                        maxStartIndexDecreasing = startIndexDecreasing;
                        longestDecreasing = [nums.slice(startIndexDecreasing, count)];
                    } else {
                        longestDecreasing.push(nums.slice(startIndexDecreasing, count));
                    }
                }
            } else {
                currentLengthDecreasing = 1;
                startIndexDecreasing = count - 1;
            }
        }

        prev = num;
    }

    await quickSort(nums, 0, nums.length - 1);

    const median = count % 2 === 0 ? (nums[count / 2 - 1] + nums[count / 2]) / 2 : nums[Math.floor(count / 2)];
    const average = sum / count;

    return {
        min,
        max,
        median,
        average,
        longestIncreasing,
        longestDecreasing
    };
}

readFileLineByLine(filePath)
    .then(({ min, max, median, average, longestIncreasing, longestDecreasing }) => {
        console.log("Min value:", min);
        console.log("Max value:", max);
        console.log("Median:", median);
        console.log("Average:", average);
        console.log("The longest increasing sequences:");
        longestIncreasing.forEach(seq => console.log(seq));
        console.log("The longest decreasing sequences:");
        longestDecreasing.forEach(seq => console.log(seq));
    })
    .catch(err => {
        console.error(err);
    });