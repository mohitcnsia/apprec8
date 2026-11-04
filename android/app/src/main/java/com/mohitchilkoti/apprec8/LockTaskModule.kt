package com.mohitchilkoti.apprec8

import android.app.ActivityManager
import android.content.Context
import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * "Lock the phone to Apprec8" (mockup N1, owner-approved 2026-11-05): Android screen pinning for the current task.
 * Without device-owner rights Android shows its own "Pin this app?" prompt the first time; leaving needs the phone's
 * PIN/pattern when "Ask for PIN before unpinning" is on (default on most phones). JS: utils/lockTask.js.
 */
class LockTaskModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  override fun getName(): String = "LockTask"

  @ReactMethod
  fun start(promise: Promise) {
    val activity = reactContext.currentActivity
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "The app is not in front.")
      return
    }
    activity.runOnUiThread {
      try {
        activity.startLockTask()
        promise.resolve(true)
      } catch (e: Exception) {
        promise.reject("LOCK_FAILED", e.message, e)
      }
    }
  }

  @ReactMethod
  fun stop(promise: Promise) {
    val activity = reactContext.currentActivity
    if (activity == null) {
      promise.resolve(false)
      return
    }
    activity.runOnUiThread {
      try {
        activity.stopLockTask()
        promise.resolve(true)
      } catch (e: Exception) {
        promise.resolve(false) // not pinned, or pinned by the user from Recents: nothing to stop
      }
    }
  }

  /** "none" | "pinned" | "locked" */
  @ReactMethod
  fun state(promise: Promise) {
    val am = reactContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
    val s = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) am.lockTaskModeState else ActivityManager.LOCK_TASK_MODE_NONE
    promise.resolve(
      when (s) {
        ActivityManager.LOCK_TASK_MODE_PINNED -> "pinned"
        ActivityManager.LOCK_TASK_MODE_LOCKED -> "locked"
        else -> "none"
      }
    )
  }
}
