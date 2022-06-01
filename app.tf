terraform {
  required_providers {
    heroku = {
      source  = "heroku/heroku"
      version = "5.0.2"
    }
  }
}

locals {
  ui_path     = "./ui"
  ui_tarball  = "./dist/ui.tar.gz"
  api_path    = "./api"
  api_tarball = "./dist/api.tar.gz"
}

variable "heroku_api_key" {
  type = string
}

provider "heroku" {
  email   = "estebangarcia2121@gmail.com"
  api_key = var.heroku_api_key
}

# API
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
resource "heroku_app" "ui" {
  name   = "fullstack-developers-ui"
  region = "us"
  stack  = "container"

  sensitive_config_vars = {
    NEXT_PUBLIC_API_ENDPOINT = "https://${heroku_app.api.name}.herokuapp.com/api"
  }
}

resource "heroku_build" "ui" {
  app_id = heroku_app.ui.id

  source {
    path = local.ui_tarball
  }
}

resource "heroku_formation" "ui" {
  app_id   = heroku_app.ui.id
  type     = "web"
  quantity = 1
  size     = "free"
}

output "api_url" {
  value       = "https://${heroku_app.api.name}.herokuapp.com/api"
  description = "API Endpoint for the website"
}
