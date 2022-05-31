#!/bin/sh
# Utility script for quickly planning or applying the backend.tf or frontend.tf
# Terraform configuration files

function display_help_msg {
  echo "|----------------------------------------------------|"
  echo "| USAGE: $0 [plan|apply|init] [frontend|backend]  |        "
  echo "|----------------------------------------------------|"
  echo "\n  !!! USE prod.tfvars FOR PRODUCTION ENVIRONMENTS !!!   \n"
}

function verify_arg {
  if [ -z "$1" ]; then
    echo "$2"
    exit 1
  fi
}

function apply_terraform_config {
  TF_ACTION=$1

  if [ $TF_ACTION == "init" ]; then
    echo "Initializing Terraform configuration..."
    terraform init $2 -input=false
    exit 0
  fi

  if [ $TF_ACTION == "plan" ]; then
    mkdir -p "tf_plans"
    terraform plan -var-file="./vars.tfvars" -out="tf_plans/plan"
    exit 0
  fi

  TARGET=$2
  verify_arg $TARGET "Please provide a target file"

  if [ $TARGET != "backend" ] && [ $TARGET != "frontend" ]; then
    echo "Please provide a valid target: backend or frontend"
    exit 1
  fi

  if [ $TF_ACTION != "apply" ] && [ $TF_ACTION != "plan" ] && [ $TF_ACTION != "init" ]; then
    echo "Please provide a valid action: apply, plan, or init"
    exit 1
  fi

  if [ $TF_ACTION == "apply" ]; then
    terraform apply tf_plans/plan
    exit 0
  fi
}

######### Main #########
if [ $# -eq 0 ]; then
  display_help_msg
  exit 1
fi

apply_terraform_config $1 $2
