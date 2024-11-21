package com.example.synergia.domain

import jakarta.persistence.*

@Entity
@Table(name = "tenant_configuration")
open class TenantConfiguration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SequenceGenerator(
        name = "tenant_configuration_seq",
        sequenceName = "tenant_configuration_seq",
        allocationSize = 1
    )
    open var id: Long? = null

    @Column(name = "id_tenant", nullable = false)
    open var idTenant: Long? = null

    @Column(name = "login_bg_hex", length = 8)
    open var loginBgHex: String? = null

    @Column(name = "login_bg_url", length = 8)
    open var loginBgUrl: String? = null

    @Column(name = "login_dark_mode")
    open var loginDarkMode: Boolean? = null
}
