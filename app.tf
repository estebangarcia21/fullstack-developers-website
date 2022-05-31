terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.4"
    }
    heroku = {
      source  = "heroku/heroku"
      version = "5.0.2"
    }
  }
}

locals {
  ui_path  = "./ui"
  api_path = "./api"
}

# API
variable "heroku_api_key" {
  type = string
}

provider "heroku" {
  email   = "estebangarcia2121@gmail.com"
  api_key = var.heroku_api_key
}

resource "heroku_app" "api" {
  name   = "fullstack-developers-api"
  region = "us"
  stack  = "container"
}

resource "heroku_build" "api" {
  app_id = heroku_app.api.id

  source {
    path = local.api_path
  }

  depends_on = [
    heroku_app.api
  ]
}

resource "heroku_formation" "api" {
  app_id   = heroku_app.api.id
  type     = "web"
  quantity = 1
  size     = "free"

  depends_on = [
    heroku_build.api
  ]
}

# UI
variable "vercel_api_token" {
  type = string
}

provider "vercel" {
  api_token = var.vercel_api_token
}

data "vercel_project_directory" "ui" {
  path = local.ui_path
}

data "vercel_project" "ui" {
  name      = "fullstack-developers-website"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = "estebangarcia21/fullstack-developers-website"
  }
}

resource "vercel_deployment" "ui" {
  project_id  = data.vercel_project.ui.id
  files       = data.vercel_project_directory.ui.files
  path_prefix = data.vercel_project_directory.ui.path
  production  = true

  environment = {
    API_ENDPOINT = join("/", [heroku_app.api.web_url, "api"])
    NODE_ENV     = "production"
  }

  depends_on = [
    heroku_app.api
  ]
}
