const { createQueues } = require("bull-board");
const jobs = require("./jobs");
require('dotenv').config();

const redisConfig = {
  redis: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || "localhost"
    // password: process.env.REDIS_PASSWORD,
  }
};

const queueClient = createQueues(redisConfig);

class Queue {
  queues = {};
  start = async () => {
    console.log("starting queue");
    const jobNames = Object.keys(jobs);
    jobNames.forEach(name => {
      const { concurrency, handler } = jobs[name];

      console.log(`Init queue ${name} with ${concurrency} concurrency `);

      const queue = queueClient.add(name);
      queue.process(concurrency, handler);

      this.queues[name] = queue;

      queue.on("completed", function(job, result) {
        return job.remove();
      });
    });
  };

  enQueue = async (name, data) => {
    await this.queues[name].add(data);
  };
}

module.exports = new Queue();
