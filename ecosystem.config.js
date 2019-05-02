module.exports = {
  apps: [
    {
      name: "backend",
      script: "./dist_backend/index.js"
    }
  ],
  deploy: {
    production: {
      user: "ubuntu",
      host: "ec2-34-222-11-55.us-west-2.compute.amazonaws.com",
      key: "~/.ssh/cspdealtools.pem",
      ref: "origin/master",
      repo: "git@github.com:calebsandfort/guerilla-deal-analyzer.git",
      path: "/home/ubuntu/cspdealtools",
      "pre-setup": "git stash",
      "post-deploy":
        "npm install && npm run build:backend && pm2 startOrRestart ecosystem.config.js"
    }
  }
};
