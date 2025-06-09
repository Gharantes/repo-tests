package com.example.synergia

import com.example.synergia.init.AppInitService
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean

@SpringBootApplication
class SynergiaApplication {

	@Bean
	fun startupRunner(service: AppInitService) = CommandLineRunner {
		service.init()
	}
}

fun main(args: Array<String>) {
	runApplication<SynergiaApplication>(*args)
}