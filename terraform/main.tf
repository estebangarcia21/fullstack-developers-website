terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.4"
    }
  }
}

variable "heroku_api_key" {
  type = string
}

variable "vercel_api_token" {
  type = string
}

module "backend" {
  source = "./backend"

  heroku_api_key = var.heroku_api_key
}

module "frontend" {
  source = "./frontend"

  vercel_api_token = var.vercel_api_token
  api_endpoint     = module.backend.heroku_app_url
}

provider "vercel" {
  api_token = var.vercel_api_token
}
