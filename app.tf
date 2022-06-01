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
  ui_path     = "./ui"
  api_path    = "./api"
  api_tarball = "./dist/api.tar.gz"
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

  sensitive_config_vars = merge({
    for tuple in regexall("(.*)=(.*)", file("${local.api_path}/.env.production")) : tuple[0] => tuple[1]
  })
}

resource "heroku_build" "api" {
  app_id = heroku_app.api.id

  source {
    path = local.api_tarball
  }
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

resource "vercel_project" "ui" {
  name           = "fullstack-developers-website"
  framework      = "nextjs"
  root_directory = "ui"

  git_repository = {
    type = "github"
    repo = "estebangarcia21/fullstack-developers-website"
  }

  environment = [
    {
      key    = "NEXT_PUBLIC_API_ENDPOINT"
      value  = "https://${heroku_app.api.name}.herokuapp.com/api"
      target = ["preview", "production"]
    }
  ]

  depends_on = [
    heroku_app.api
  ]
}

resource "vercel_deployment" "ui" {
  project_id  = resource.vercel_project.ui.id
  files       = data.vercel_project_directory.ui.files
  path_prefix = data.vercel_project_directory.ui.path
  production  = true

  environment = {
    "NODE_ENV" = "production"
  }

  depends_on = [
    heroku_app.api
  ]
}

output "api_url" {
  value       = "https://${heroku_app.api.name}.herokuapp.com/api"
  description = "API endpoint"
}

output "dyno_vars" {
  value       = heroku_app.api.sensitive_config_vars
  description = "Sensitive config values for the API"
  sensitive   = true
}
