package com.example.synergia.domainRepositories

import com.example.synergia.domain.TagsEntity
import org.springframework.data.jpa.repository.JpaRepository

interface TagsRepository : JpaRepository<TagsEntity, Long> {
}