terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region  = "us-east-1"
}

resource "aws_instance" "app_server" {
  ami           = "ami-08c40ec9ead489470"
  instance_type = "t2.small"
  count         = 1
  key_name      = "itesoASN"
  vpc_security_group_ids = [aws_security_group.client-sg.id]



  root_block_device {
    volume_size = 50
  }

  provisioner "file" {
        source      = "/Users/luis/Documents/Client/linux-agent"
        destination = "/home/ubuntu/linux-agent"
       
        connection {
        type        = "ssh"
        user        = "ubuntu"
        private_key = "${file("/Users/luis/Downloads/itesoASN.pem")}"
        host        = "${self.public_ip}"
        }
  }

    provisioner "file" {
        source      = "/Users/luis/Documents/Client/config.txt"
        destination = "/home/ubuntu/config.txt"
       
        connection {
        type        = "ssh"
        user        = "ubuntu"
        private_key = "${file("/Users/luis/Downloads/itesoASN.pem")}"
        host        = "${self.public_ip}"
        }
  }

  user_data = <<-EOL
        #! /bin/bash

        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        sudo chmod 666 /var/run/docker.sock  
        sudo chmod 777 /home/ubuntu/linux-agent
        ./home/ubuntu/linux-agent /home/ubuntu/config.txt 
  EOL

  tags = {
    Name = "client-${count.index + 1}"
  }
}

resource "aws_security_group" "client-sg" {
  name = "sec-grp"
  description = "Allow HTTP and SSH traffic via Terraform"

  ingress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"] 
    ipv6_cidr_blocks = ["::/0"]
  }

   egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"] 
    ipv6_cidr_blocks = ["::/0"]
  }

}