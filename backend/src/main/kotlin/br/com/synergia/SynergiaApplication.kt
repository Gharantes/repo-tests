package br.com.synergia

import br.com.synergia.utilsInit.services.InitService
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean

@SpringBootApplication
class SynergiaApplication {

	@Bean
	fun startupRunner(initService: InitService) = CommandLineRunner {
		initService.checkActions()
		 // initService.initTestData()
	}
}

fun main(args: Array<String>) {
	runApplication<SynergiaApplication>(*args)
}