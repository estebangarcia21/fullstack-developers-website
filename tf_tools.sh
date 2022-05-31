#!/bin/sh
# Utility script for quickly planning or applying the backend.tf or frontend.tf
# Terraform configuration files

function display_help_msg {
  echo "|----------------------------------------------------|"
  echo "| USAGE: $0 [plan|apply|upgrade]                     |"
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

  # Verify actions
  if [ $TF_ACTION != "apply" ] && [ $TF_ACTION != "plan" ] && [ $TF_ACTION != "upgrade" ]; then
    echo "Please provide a valid action: apply, plan, or init"
    exit 1
  fi

  # Execute action logic
  if [ $TF_ACTION == "upgrade" ]; then
    echo "Initializing Terraform configuration..."
    terraform init -upgrade -input=false
    exit 0
  fi

  if [ $TF_ACTION == "plan" ]; then
    mkdir -p "tf_plans"
    echo "Creating api tarball"

    sh -c "$(cat ./build_api_tarball.sh)"

    echo "Planning Terraform configuration..."
    terraform plan -var-file="./vars.tfvars" -out="tf_plans/plan"
    exit 0
  fi

  TARGET=$2
  verify_arg $TARGET "Please provide a target file"

  if [ $TF_ACTION == "apply" ]; then
    echo "Applying Terraform configuration..."
    terraform apply "tf_plans/plan"
    exit 0
  fi
}

######### Main #########
if [ $# -eq 0 ]; then
  display_help_msg
  exit 1
fi

apply_terraform_config $1
