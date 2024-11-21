package com.example.synergia.rest.utility_based

import com.example.synergia.utils.objects.MediaTypes
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/template")
class TemplateManagerResource {
    @PostMapping(
        "template-for-creating-accounts-in-mass",
        produces = [MediaTypes.XLSX],
    ) fun generateTemplateForCreatingAccountsInMass(): ResponseEntity<Void> {
        return ResponseMessenger.buildResponse(null) {
            null
        }
    }

    }